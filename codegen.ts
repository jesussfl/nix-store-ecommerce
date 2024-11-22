import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  // overwrite: true,
  // schema: 'https://nix-store-admin-production.up.railway.app/shop-api',
  schema: 'http://localhost:3000/shop-api',
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
