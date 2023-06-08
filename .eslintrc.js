module.exports = {
  env: {
    es6: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  root: true,
  extends: ['plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unused-imports'],
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
  overrides: [],
};
