module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'indent': ['error', 2],
    'no-multi-spaces': 'error',
    'no-trailing-spaces': 'error',
    'prettier/prettier': ['error', { semi: true, singleQuote: true, tabWidth: 2 }]
  },
}
