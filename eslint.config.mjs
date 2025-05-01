import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const config = [
  ...compat.extends('@rocketseat/eslint-config/node'),
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js built-in modules
            'external', // Packages from node_modules
            'internal', // Imports from the src directory
            ['parent', 'sibling'], // Relative imports
            'index', // Index of the current directory
            'object', // Object imports
            'type', // Type imports
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc', // Sort imports alphabetically
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: '@/domain/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/shared/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/tests/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-named-as-default': 'warn',
      'import/no-named-as-default-member': 'warn',
      'import/no-duplicates': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        node: true,
      },
    },
  },
  // Disable problematic TypeScript rules due to version compatibility
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Disable the rule causing the error
      '@typescript-eslint/no-duplicate-enum-values': 'off',
    },
  },
  // Add Prettier plugin with recommended configuration
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      // Disable rules that might conflict with Prettier
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
    },
  },
  // Include eslint-config-prettier last to override any conflicting style rules
  eslintConfigPrettier,
]

export default config
