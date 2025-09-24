import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import vueParser from 'vue-eslint-parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser, // for <script lang="ts">
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        window: true,
        document: true,
        localStorage: true,
        console: true,
        setTimeout: true,
        clearTimeout: true,
        __dirname: true,
        Event: true,
        HTMLElement: true,
        HTMLInputElement: true,
        HTMLFormElement: true,
        KeyboardEvent: true,
        TouchEvent: true,
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': typescript,
      prettier,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-multi-spaces': 'error',
      'no-trailing-spaces': 'error',
      'prettier/prettier': ['error', { semi: true, singleQuote: true, tabWidth: 2 }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        window: true,
        document: true,
        localStorage: true,
        console: true,
        setTimeout: true,
        clearTimeout: true,
        __dirname: true,
        Event: true,
        HTMLElement: true,
        HTMLInputElement: true,
        HTMLFormElement: true,
        KeyboardEvent: true,
        TouchEvent: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'no-multi-spaces': 'error',
      'no-trailing-spaces': 'error',
      'prettier/prettier': ['error', { semi: true, singleQuote: true, tabWidth: 2 }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
];
