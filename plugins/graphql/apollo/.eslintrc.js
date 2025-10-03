module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    '../dev-tools/default/.eslintrc.json',
    'plugin:graphql/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['graphql'],
  rules: {
    // GraphQL rules
    'graphql/template-strings': [
      'error',
      {
        env: 'apollo',
        schemaJsonFilepath: 'lib/generated/introspection.json',
        tagName: 'gql',
      },
    ],
    'graphql/named-operations': [
      'error',
      {
        schemaJsonFilepath: 'lib/generated/introspection.json',
      },
    ],
    'graphql/required-fields': [
      'error',
      {
        env: 'apollo',
        schemaJsonFilepath: 'lib/generated/introspection.json',
        requiredFields: ['id'],
      },
    ],
  },
  settings: {
    'graphql/cache': {
      schemaJsonFilepath: 'lib/generated/introspection.json',
    },
  },
};
