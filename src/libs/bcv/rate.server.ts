/**
 * Server-only source of truth for the official BCV USD/Bs rate.
 *
 * `server-only` is not a project dependency, so this stays server-safe by
 * naming convention (`.server.ts`) and by never being imported from a
 * client component. Import `getBcvRate` directly in server components;
 * client components must go through `/api/bcv-rate` via
 * `@/utils/get-bcv-price` instead.
 *
 * Selection rule
 * --------------
 * BCV (bcv.org.ve) is the primary source and dolarapi.com is the fallback.
 * Both publish a rate together with the date it applies to ("Fecha Valor").
 * BCV usually publishes the next business day's rate in the afternoon, but
 * banks only start applying that rate on its own Fecha Valor — using it a
 * day early would overcharge customers relative to what BCV publishes as
 * "today's" rate elsewhere. So candidates are filtered to `valueDate <=
 * today` (today in America/Caracas) and the greatest remaining `valueDate`
 * wins (ties prefer 'bcv'). A small in-process memory of recent BCV rates
 * (keyed by valueDate) keeps today's rate available for this comparison
 * even after BCV has already posted tomorrow's rate.
 *
 * That memory is lost on restart/deploy. If the best eligible rate is not
 * a BCV rate (only dolarapi, which lags BCV by days) and BCV has already
 * published a future-dated rate, the earliest future BCV rate is used
 * instead: one day ahead is closer to reality than several days behind.
 * If nothing is eligible at all, the earliest-dated candidate is used
 * rather than blocking checkout. If every source fails, `{ rate: 0, valueDate: '',
 * source: 'dolarapi' }` is returned — existing callers already treat
 * `rate: 0` as "unavailable".
 *
 * The result is cached in memory for 10 minutes (1 minute on failure) and
 * concurrent calls are deduplicated.
 */
import https from 'node:https'
import tls from 'node:tls'
import { BcvRate } from './types'

const BCV_HOSTNAME = 'www.bcv.org.ve'
const DOLARAPI_URL = 'https://ve.dolarapi.com/v1/dolares/oficial'
const REQUEST_TIMEOUT_MS = 8000
const SUCCESS_CACHE_TTL_MS = 10 * 60 * 1000
const FAILURE_CACHE_TTL_MS = 60 * 1000
const REMEMBERED_BCV_RATES_LIMIT = 5
const VALUE_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/**
 * Intermediate certificate `bcv.org.ve` fails to send: "Sectigo Public
 * Server Authentication CA DV R36", issued by "Sectigo Public Server
 * Authentication Root R46". Without it Node rejects the leaf cert with
 * UNABLE_TO_VERIFY_LEAF_SIGNATURE (curl/browsers tolerate the gap; Node
 * does not). Fetched from the leaf certificate's AIA "CA Issuers" URL
 * (http://crt.sectigo.com/SectigoPublicServerAuthenticationCADVR36.crt) and
 * verified to fix `https.request` TLS verification against this host.
 */
const BCV_INTERMEDIATE_PEM = `-----BEGIN CERTIFICATE-----
MIIGTDCCBDSgAwIBAgIQOXpmzCdWNi4NqofKbqvjsTANBgkqhkiG9w0BAQwFADBf
MQswCQYDVQQGEwJHQjEYMBYGA1UEChMPU2VjdGlnbyBMaW1pdGVkMTYwNAYDVQQD
Ey1TZWN0aWdvIFB1YmxpYyBTZXJ2ZXIgQXV0aGVudGljYXRpb24gUm9vdCBSNDYw
HhcNMjEwMzIyMDAwMDAwWhcNMzYwMzIxMjM1OTU5WjBgMQswCQYDVQQGEwJHQjEY
MBYGA1UEChMPU2VjdGlnbyBMaW1pdGVkMTcwNQYDVQQDEy5TZWN0aWdvIFB1Ymxp
YyBTZXJ2ZXIgQXV0aGVudGljYXRpb24gQ0EgRFYgUjM2MIIBojANBgkqhkiG9w0B
AQEFAAOCAY8AMIIBigKCAYEAljZf2HIz7+SPUPQCQObZYcrxLTHYdf1ZtMRe7Yeq
RPSwygz16qJ9cAWtWNTcuICc++p8Dct7zNGxCpqmEtqifO7NvuB5dEVexXn9RFFH
12Hm+NtPRQgXIFjx6MSJcNWuVO3XGE57L1mHlcQYj+g4hny90aFh2SCZCDEVkAja
EMMfYPKuCjHuuF+bzHFb/9gV8P9+ekcHENF2nR1efGWSKwnfG5RawlkaQDpRtZTm
M64TIsv/r7cyFO4nSjs1jLdXYdz5q3a4L0NoabZfbdxVb+CUEHfB0bpulZQtH1Rv
38e/lIdP7OTTIlZh6OYL6NhxP8So0/sht/4J9mqIGxRFc0/pC8suja+wcIUna0HB
pXKfXTKpzgis+zmXDL06ASJf5E4A2/m+Hp6b84sfPAwQ766rI65mh50S0Di9E3Pn
2WcaJc+PILsBmYpgtmgWTR9eV9otfKRUBfzHUHcVgarub/XluEpRlTtZudU5xbFN
xx/DgMrXLUAPaI60fZ6wA+PTAgMBAAGjggGBMIIBfTAfBgNVHSMEGDAWgBRWc1hk
lfmSGrASKgRieaFAFYghSTAdBgNVHQ4EFgQUaMASFhgOr872h6YyV6NGUV3LBycw
DgYDVR0PAQH/BAQDAgGGMBIGA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0lBBYwFAYI
KwYBBQUHAwEGCCsGAQUFBwMCMBsGA1UdIAQUMBIwBgYEVR0gADAIBgZngQwBAgEw
VAYDVR0fBE0wSzBJoEegRYZDaHR0cDovL2NybC5zZWN0aWdvLmNvbS9TZWN0aWdv
UHVibGljU2VydmVyQXV0aGVudGljYXRpb25Sb290UjQ2LmNybDCBhAYIKwYBBQUH
AQEEeDB2ME8GCCsGAQUFBzAChkNodHRwOi8vY3J0LnNlY3RpZ28uY29tL1NlY3Rp
Z29QdWJsaWNTZXJ2ZXJBdXRoZW50aWNhdGlvblJvb3RSNDYucDdjMCMGCCsGAQUF
BzABhhdodHRwOi8vb2NzcC5zZWN0aWdvLmNvbTANBgkqhkiG9w0BAQwFAAOCAgEA
YtOC9Fy+TqECFw40IospI92kLGgoSZGPOSQXMBqmsGWZUQ7rux7cj1du6d9rD6C8
ze1B2eQjkrGkIL/OF1s7vSmgYVafsRoZd/IHUrkoQvX8FZwUsmPu7amgBfaY3g+d
q1x0jNGKb6I6Bzdl6LgMD9qxp+3i7GQOnd9J8LFSietY6Z4jUBzVoOoz8iAU84OF
h2HhAuiPw1ai0VnY38RTI+8kepGWVfGxfBWzwH9uIjeooIeaosVFvE8cmYUB4TSH
5dUyD0jHct2+8ceKEtIoFU/FfHq/mDaVnvcDCZXtIgitdMFQdMZaVehmObyhRdDD
4NQCs0gaI9AAgFj4L9QtkARzhQLNyRf87Kln+YU0lgCGr9HLg3rGO8q+Y4ppLsOd
unQZ6ZxPNGIfOApbPVf5hCe58EZwiWdHIMn9lPP6+F404y8NNugbQixBber+x536
WrZhFZLjEkhp7fFXf9r32rNPfb74X/U90Bdy4lzp3+X1ukh1BuMxA/EEhDoTOS3l
7ABvc7BYSQubQ2490OcdkIzUh3ZwDrakMVrbaTxUM2p24N6dB+ns2zptWCva6jzW
r8IWKIMxzxLPv5Kt3ePKcUdvkBU/smqujSczTzzSjIoR5QqQA6lN1ZRSnuHIWCvh
JEltkYnTAH41QJ6SAWO66GrrUESwN/cgZzL4JLEqz1Y=
-----END CERTIFICATE-----`

const UNAVAILABLE_RATE: BcvRate = { rate: 0, valueDate: '', source: 'dolarapi' }

/** valueDate (YYYY-MM-DD) -> rate, for BCV rates seen this process. */
const rememberedBcvRates = new Map<string, number>()

let cachedResult: { result: BcvRate; expiresAt: number } | null = null
let inFlightRequest: Promise<BcvRate> | null = null

function getCaracasToday(): string {
  // en-CA formats as YYYY-MM-DD, which matches valueDate and sorts correctly
  // as a plain string.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Caracas',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function getNextCaracasMidnight(): number {
  // Venezuela has no DST; it is always UTC-04:00.
  const todayStart = new Date(`${getCaracasToday()}T00:00:00-04:00`).getTime()
  return todayStart + 24 * 60 * 60 * 1000
}

/**
 * Parses the USD rate and its Fecha Valor out of the bcv.org.ve homepage
 * HTML. Pure and defensive: returns null on anything unexpected instead of
 * throwing, since page markup can change without notice.
 */
export function parseBcvHtml(
  html: string
): { rate: number; valueDate: string } | null {
  if (!html) return null

  const blockStart = html.indexOf('id="dolar"')
  if (blockStart === -1) return null

  // The USD block and its Fecha Valor sit within a bounded stretch of the
  // page; capping the search window keeps a change elsewhere on the page
  // from being misread as the dolar block.
  const block = html.slice(blockStart, blockStart + 2000)

  const rateMatch = block.match(/<strong[^>]*>\s*([\d.,]+)\s*<\/strong>/)
  const dateMatch = block.match(
    /date-display-single"[^>]*\bcontent="(\d{4}-\d{2}-\d{2})T/
  )

  if (!rateMatch || !dateMatch) return null

  // "842,20670000" -> 842.20670000 (thousands separator is '.', decimal is ',')
  const normalized = rateMatch[1].replace(/\./g, '').replace(',', '.')
  const rate = Number.parseFloat(normalized)
  const valueDate = dateMatch[1]

  if (!Number.isFinite(rate) || rate <= 0) return null
  if (!VALUE_DATE_PATTERN.test(valueDate)) return null

  return { rate, valueDate }
}

function fetchBcvHtml(): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: BCV_HOSTNAME,
        port: 443,
        path: '/',
        method: 'GET',
        servername: BCV_HOSTNAME,
        ca: [...tls.rootCertificates, BCV_INTERMEDIATE_PEM],
        timeout: REQUEST_TIMEOUT_MS,
      },
      (res) => {
        const statusCode = res.statusCode ?? 0
        if (statusCode < 200 || statusCode >= 300) {
          res.resume()
          reject(new Error(`bcv.org.ve responded with status ${statusCode}`))
          return
        }

        const chunks: Buffer[] = []
        res.on('data', (chunk: Buffer) => chunks.push(chunk))
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
        res.on('error', reject)
      }
    )

    req.on('timeout', () =>
      req.destroy(new Error('bcv.org.ve request timed out'))
    )
    req.on('error', reject)
    req.end()
  })
}

async function fetchFromBcv(): Promise<BcvRate | null> {
  try {
    const html = await fetchBcvHtml()
    const parsed = parseBcvHtml(html)
    if (!parsed) return null

    return { rate: parsed.rate, valueDate: parsed.valueDate, source: 'bcv' }
  } catch (error) {
    console.error('Error fetching BCV rate from bcv.org.ve:', error)
    return null
  }
}

async function fetchFromDolarApi(): Promise<BcvRate | null> {
  try {
    const data = await fetch(DOLARAPI_URL, {
      method: 'GET',
      cache: 'no-store',
    }).then((res) => res.json())

    const entry = Array.isArray(data) ? data[0] : data
    const rate = Number(entry?.promedio)
    const valueDate =
      typeof entry?.fechaActualizacion === 'string'
        ? entry.fechaActualizacion.slice(0, 10)
        : ''

    if (
      !Number.isFinite(rate) ||
      rate <= 0 ||
      !VALUE_DATE_PATTERN.test(valueDate)
    ) {
      return null
    }

    return { rate, valueDate, source: 'dolarapi' }
  } catch (error) {
    console.error('Error fetching BCV rate from dolarapi:', error)
    return null
  }
}

function rememberBcvRate(candidate: BcvRate | null) {
  if (!candidate || candidate.source !== 'bcv') return

  rememberedBcvRates.set(candidate.valueDate, candidate.rate)

  while (rememberedBcvRates.size > REMEMBERED_BCV_RATES_LIMIT) {
    const oldestKey = rememberedBcvRates.keys().next().value
    if (oldestKey === undefined) break
    rememberedBcvRates.delete(oldestKey)
  }
}

/**
 * Picks the rate to use for `today` out of a list of candidates. Exported
 * for testing; pure function, no I/O.
 */
export function selectBcvRate(candidates: BcvRate[], today: string): BcvRate {
  const eligible = candidates.filter(
    (candidate) => candidate.valueDate <= today
  )

  const bestEligible =
    eligible.length > 0
      ? eligible.reduce((best, candidate) => {
          if (candidate.valueDate > best.valueDate) return candidate
          if (
            candidate.valueDate === best.valueDate &&
            candidate.source === 'bcv' &&
            best.source !== 'bcv'
          ) {
            return candidate
          }
          return best
        })
      : null

  if (bestEligible?.source === 'bcv') return bestEligible

  // No BCV rate for today is known (e.g. after a restart once BCV has posted
  // tomorrow's rate). Prefer BCV's next rate over a lagging dolarapi one.
  const nextBcv = candidates
    .filter(
      (candidate) => candidate.source === 'bcv' && candidate.valueDate > today
    )
    .reduce<BcvRate | null>(
      (earliest, candidate) =>
        !earliest || candidate.valueDate < earliest.valueDate
          ? candidate
          : earliest,
      null
    )

  if (nextBcv) return nextBcv
  if (bestEligible) return bestEligible

  // Everything is future-dated and none is BCV: never block checkout.
  return candidates.reduce((earliest, candidate) =>
    candidate.valueDate < earliest.valueDate ? candidate : earliest
  )
}

async function computeBcvRate(): Promise<BcvRate> {
  const [bcvCandidate, dolarApiCandidate] = await Promise.all([
    fetchFromBcv(),
    fetchFromDolarApi(),
  ])

  rememberBcvRate(bcvCandidate)

  const rememberedCandidates: BcvRate[] = Array.from(
    rememberedBcvRates.entries()
  ).map(([valueDate, rate]) => ({ rate, valueDate, source: 'bcv' as const }))

  const candidates = [
    bcvCandidate,
    dolarApiCandidate,
    ...rememberedCandidates,
  ].filter((candidate): candidate is BcvRate => candidate !== null)

  if (candidates.length === 0) {
    return { ...UNAVAILABLE_RATE }
  }

  return selectBcvRate(candidates, getCaracasToday())
}

/**
 * Returns the BCV/Bs rate to use right now. Always resolves (never
 * rejects); `rate: 0` means every source failed. Cached for 10 minutes on
 * success and 1 minute on failure, with concurrent calls deduplicated.
 */
export async function getBcvRate(): Promise<BcvRate> {
  const now = Date.now()

  if (cachedResult && cachedResult.expiresAt > now) {
    return cachedResult.result
  }

  if (inFlightRequest) {
    return inFlightRequest
  }

  inFlightRequest = computeBcvRate()
    .then((result) => {
      const ttl = result.rate > 0 ? SUCCESS_CACHE_TTL_MS : FAILURE_CACHE_TTL_MS
      cachedResult = {
        result,
        // Never carry a selection past Caracas midnight: a rate that was
        // future-dated today becomes eligible at 00:00.
        expiresAt: Math.min(Date.now() + ttl, getNextCaracasMidnight()),
      }
      return result
    })
    .finally(() => {
      inFlightRequest = null
    })

  return inFlightRequest
}
