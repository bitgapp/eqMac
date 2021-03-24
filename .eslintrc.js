module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      './ui/tsconfig.eslint.json'
    ]
  },
  overrides: [{
    files: ['*.ts'],
    rules: {
      radix: 'off',
      'accessor-pairs': 'off',
      'return-undefined': 'off',
      'no-throw-literal': 'off',
      'import-first': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/promise-function-async': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      'array-bracket-spacing': ['error', 'always'],
      '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/return-await': 'off',
      'node/no-callback-literal': 'off',
      'no-async-promise-executor': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off'
    }
  }],
  env: {
    node: true
  }
}
