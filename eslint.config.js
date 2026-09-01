const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const unusedImports = require('eslint-plugin-unused-imports');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
  {
    ignores: [
      'dist/**',
      'test/**',

      // Ignore generated/imported GraphQL files
      '**/*.graphql',
      '**/*.graphql-gen.ts',

      // Ignore generated journey planner types
      'src/graphql/journey-types.ts',
      'src/graphql/journey/journeyplanner-types_v3.ts',
      'src/graphql/mobility/mobility-types_v2.ts',
      'src/graphql/vehicles/vehicles-types_v2.ts',
    ],
  },
  prettierRecommended,
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      'no-console': [1, {allow: ['warn', 'error']}],
      'no-fallthrough': 2,
      'unused-imports/no-unused-imports': 2,
      'unused-imports/no-unused-vars': [
        2,
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
];
