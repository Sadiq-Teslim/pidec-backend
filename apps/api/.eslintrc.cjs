module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    // Clean Architecture: presentation must not import from infrastructure
    // (use cases compose them — direct skips are a smell). The check below
    // is conservative; real enforcement is in CR + dependency-cruiser if
    // we add it later.
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../infrastructure/*', '../../infrastructure/*'],
            message: 'presentation/ may only depend on application/ and domain/. Move infra calls into a use case.',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['src/infrastructure/**/*.ts', 'src/infrastructure/**/*.tsx', 'src/application/**/*.ts', 'src/index.ts', 'src/app.ts'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
  ignorePatterns: ['dist/', 'node_modules/'],
};
