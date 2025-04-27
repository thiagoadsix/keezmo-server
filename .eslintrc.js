module.exports = {
  plugins: ['import'],
  extends: ['plugin:import/recommended'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: true,
    },
  },
  rules: {
    'import/order': [
      'error',
      {
        groups: ['external', 'internal', ['parent', 'sibling', 'index']],
        pathGroups: [
          {
            pattern: '@domain/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@shared/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['internal'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
      },
    ],
  },
}
