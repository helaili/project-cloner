import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  emitLegacyCommonJSImports: false,
  schema: [
    {
      'https://api.github.com/graphql': {
        headers: {
          'User-Agent': 'graphql-codegen',
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      },
    },
  ],
  documents: ["src/mutations/*.graphql", "src/queries/*.graphql"],
  generates: {
    "src/generated/gql/": {
      preset: 'client-preset',
    }
  }
};

module.exports = config;