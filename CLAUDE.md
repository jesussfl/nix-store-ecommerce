# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Next.js 16 (App Router, React 19) storefront for **Nix Store**, backed by a separate **Vendure** server (shop-api over GraphQL). Spanish-only, Venezuelan market: catalog prices are in USD and are also shown in bolívares (Bs) at the official BCV rate. Package manager is **yarn**.

## Commands

```bash
yarn dev            # runs codegen once (predev), then next dev + codegen watcher concurrently
yarn dev2           # next dev only, no codegen
yarn build          # next build with ESLint disabled
yarn build:strict   # next build with ESLint enabled
yarn lint           # eslint src
yarn generate       # regenerate src/graphql/ and schema.graphql from the live Vendure schema
```

There is no test runner. `next.config.js` sets `typescript.ignoreBuildErrors: true`, so builds do not catch type errors. Run `npx tsc --noEmit` to typecheck.

Codegen introspects a **running** Vendure shop-api (`$NEXT_PUBLIC_VENDURE_ADMIN_DOMAIN/shop-api`, otherwise the production Railway URL or `http://localhost:3000/shop-api`). `yarn dev` and `yarn start` fail at the pre-hook if that endpoint is unreachable. In that case, use `yarn dev2`.

## Architecture

### GraphQL / Vendure data layer
- Write documents with `graphql()` from `@/graphql` in `src/libs/queries/*.ts` and `src/libs/mutations/*.ts`. Codegen scans `src/**/*.{ts,tsx}` and emits typed `TypedDocumentString`s into `src/graphql/` (generated, do not edit). `Money` is typed as `number`. Rerun codegen after adding or changing a document.
- `src/libs/vendure/index.ts` → `vendureFetch`: for Client Components. In the browser it POSTs to the same-origin proxy `/api/vendure`. On the server it calls Vendure directly. It sends `?languageCode=` and a `vendure-token` header, both set to the language code.
- `src/app/api/vendure/route.ts`: proxy that forwards the `Cookie` header to Vendure and relays `Set-Cookie` back. Session and auth are **cookie-based only**, with no bearer tokens.
- `src/libs/vendure/vendureFetchSSR.ts` → `vendureFetchSSR`: for server components. It forwards request cookies, defaults to `cache: 'force-cache'`, and supports `tags`/`revalidate`.
- `src/libs/vendure/config.ts` → `getVendureDomain()` resolves the backend host (`VENDURE_ADMIN_DOMAIN` → `NEXT_PUBLIC_VENDURE_ADMIN_DOMAIN` → env-based fallback). New Vendure asset hosts must also be allowed in `next.config.js` `images.remotePatterns`.

### Routing & i18n
- All customer routes live under `src/app/[locale]/(customers)/`. `src/proxy.ts` is the next-intl middleware (Next 16's replacement for `middleware.ts`).
- `src/i18n/routing.ts`: the only locale is `es`, with `localePrefix: 'as-needed'`. A `pathnames` map rewrites Spanish public URLs to internal paths (`/catalogo` → `/catalog`, `/catalogo/detalles/[productSlug]`, and others). Use `Link`/`redirect`/`useRouter` from `@/i18n/routing`, not from `next/*`.
- Messages are in the root `messages/`. `src/i18n/request.tsx` uses `es.json` as the base and merges locale overrides on top. Default time zone is `America/Caracas`.

### State
- `src/components/cart/cart-context.tsx` (`unstated-next`): active order, current customer, login state, and the cart drawer. Every cart and checkout mutation goes through it via `vendureFetch`, with optimistic updates that roll back through `fetchActiveOrder()`.
- `src/libs/context/bcv-price-context.tsx` (`unstated-next`, `BcvRateProvider`/`useBcvRate`): checkout-payment-step-only container holding the single `BcvRate` shared by `OrderSummary`, `PaymentFields`, and `PaymentForm`. `refresh()` re-fetches `/api/bcv-rate`, only updating on `rate > 0`, and also runs (throttled to once per 60s) on tab focus/visibility.

### Currency (BCV) — money invariants
- `src/libs/bcv/rate.server.ts` (`getBcvRate`) is the single source of the **USD** official rate. Server Components must import it directly — never call `/api/bcv-rate` from a Server Component. It tries bcv.org.ve first (HTML scrape of the `id="dolar"` block, with a bundled intermediate cert since the host omits one) and falls back to `ve.dolarapi.com/v1/dolares/oficial`. Each candidate carries its own "Fecha Valor" (`valueDate`, `YYYY-MM-DD`); the candidate with the greatest `valueDate` that is `<= today` (America/Caracas) wins, ties preferring `'bcv'` — this stops a rate BCV publishes in advance for the next business day from being applied before its own date. A small in-process memory of recent BCV rates keeps today's rate selectable even after BCV has posted tomorrow's. That memory is lost on restart; when no BCV rate is eligible and only dolarapi (which lags by days) remains, the next future-dated BCV rate is used instead. Result is cached 10 minutes on success, 1 minute on failure, concurrent calls deduplicated. Returns `{ rate: 0, valueDate: '', source: 'dolarapi' }` when every source fails. Callers must treat `rate: 0` as "unavailable" and never divide by it.
- `src/app/api/bcv-rate/route.ts` exposes `getBcvRate()` as JSON (`no-store`) for Client Components. `src/utils/get-bcv-price.ts` (`GetBCVRateInfo`, `GetBCVPrice`) wraps that fetch and is the only BCV import allowed in client-bundled code — it must never import `@/libs/bcv/rate.server` (that module uses `node:https` and is server-only).
- Never hardcode a rate. Pass the server-fetched rate down (checkout pages fetch it in the RSC and pass it as a prop, or via `BcvRateProvider` on the payment step).
- **One rate per payment step**: on `checkout/payment/page.tsx`, `OrderSummary`'s Bs total, `PaymentFields`' conversion hint, and `PaymentForm`'s submit conversion all read the same `BcvRateProvider` rate — never fetch the rate independently there. Before submitting a Bs payment (`pago-movil`/`transferencia`), `PaymentForm` calls `refresh()`; if the rate changed since it was last shown, the submit is aborted with a toast instead of silently charging at a different rate.
- Bs payments (`pago-movil`/`transferencia`) send `tasa` (rate), `'fecha valor'` (`valueDate`), and `fuente` (`source`) in the payment metadata alongside the existing `referencia`, `monto`, `'fecha de pago'`, `telefono`.
- Bs→USD payment conversion rounds to **cents** (`Math.round(x * 100) / 100`). Rounding to whole dollars can push a valid partial payment below the backend's `initialPercentage` threshold.
- Format prices with `src/utils/price-formatter.ts` (`es-VE`, `narrowSymbol`).

### Checkout
Flow: `checkout/page.tsx` (shipping) → `checkout/payment/page.tsx` → `checkout/confirmation/[order]/page.tsx`. The route files are thin RSC wrappers around `src/components/pages/checkout/*`.
- Shipping methods are selected **strictly by Vendure `ShippingMethod.code`** (`SHIPPING_METHOD_CODE` in `checkout-form.tsx` maps `delivery`/`national`/`personal`). Never fall back to the first method or a fuzzy match: that can bill a pickup order as national shipping.
- Submit sets the shipping address, then the shipping method, then transitions the order to `ArrangingPayment`.
- The PDF receipt comes from the server action `src/app/actions/generate-receipt.ts` (jsPDF).

### Components & conventions
- `src/components/shared/<name>/`: shadcn/ui-style primitives (`components.json`).
- `src/components/pages/<page>/`: page-specific composed components used by thin route files.
- Path aliases: `@/*` → `src/*`, `@public/*` → `public/*`.
- Prettier: no semicolons, single quotes, 2 spaces, `es5` trailing commas, Tailwind class sorting.
- `eslint.config.mjs` **ignores** `src/components/shared/cart/`, `src/components/pages/checkout/`, and `src/libs/queries/product.ts`, so lint gives no coverage for the money-critical checkout/cart code. Review changes there carefully.

## Environment

`NEXT_PUBLIC_VENDURE_ADMIN_DOMAIN` / `VENDURE_ADMIN_DOMAIN` (Vendure host), `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_ITEMS_PER_PAGE`. See `.env.example`.
