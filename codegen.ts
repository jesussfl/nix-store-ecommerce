import type { CodegenConfig } from '@graphql-codegen/cli'

const isProd = 
  process.env.NODE_ENV === 'production' || 
  process.env.RAILWAY_ENVIRONMENT === 'production' ||
  process.env.VERCEL_ENV === 'production';

let schemaUrl = isProd 
  ? 'https://nix-store-admin-production.up.railway.app/shop-api'
  : 'http://localhost:3000/shop-api';

if (process.env.NEXT_PUBLIC_VENDURE_ADMIN_DOMAIN) {
  schemaUrl = `${process.env.NEXT_PUBLIC_VENDURE_ADMIN_DOMAIN}/shop-api`;
}

const config: CodegenConfig = {
  // overwrite: true,
  schema: schemaUrl,
  documents: 'src/**/*.{ts,tsx}',
  ignoreNoDocuments: true,
  generates: {
    'src/graphql/': {
      preset: 'client',
      // plugins: [],
      config: {
        scalars: {
          // This tells codegen that the `Money` scalar is a number
          Money: 'number',
        },
        namingConvention: {
          // This ensures generated enums do not conflict with the built-in types.
          enumValues: 'keep',
        },
        documentMode: 'string',
      },
    },
    './schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
    },
  },
}

export default config
