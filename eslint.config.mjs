import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    "**/node_modules/",
    "**/.next/",
    "**/out/",
    "**/.next/",
    "**/out/",
    "**/build/",
    "**/dist/",
    "**/node_modules/",
    "**/*.min.js",
    "**/.DS_Store",
    "**/.env",
    "**/.env.local",
    "**/.env.development.local",
    "**/.env.test.local",
    "**/.env.production.local",
    "src/components/shared/cart/",
    "src/components/pages/checkout/",
    "src/libs/queries/product.ts",
]), {
    extends: compat.extends("next/core-web-vitals", "plugin:@typescript-eslint/recommended"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
    },

    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "react-hooks/exhaustive-deps": "off",
        "import/no-anonymous-default-export": "off",
        "@next/next/no-img-element": "off",
        "no-restricted-globals": "off",
    },
}]);