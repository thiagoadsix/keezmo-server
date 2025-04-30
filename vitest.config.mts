import path from 'path'

import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

import tsconfig from './tsconfig.json'

const alias = Object.fromEntries(
  Object.entries(tsconfig.compilerOptions.paths).map(([key, [value]]) => [
    key.replace('/*', ''),
    path.resolve(__dirname, value.replace('/*', '')),
  ]),
)

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      '__tests__/**/*.test.+(ts|tsx|js)',
      '__tests__/**/*.spec.+(ts|tsx|js)',
    ],
    exclude: [
      '__tests__/fixtures/**',
      '__tests__/mocks/**',
      'src/**/index.ts',
      './*.js',
      './*.mjs',
      './*.mts',
      './scripts/**',
      './**/*.d.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '__tests__/fixtures/**',
        '__tests__/mocks/**',
        'src/**/index.ts',
        'src/domain/interfaces/**',
        'src/domain/types/**',
        './*.js',
        './*.mjs',
        './*.mts',
        './scripts/**',
        './**/*.d.ts'
      ],
    },
    root: './',
  },

  plugins: [tsconfigPaths()],
  resolve: {
    alias,
  },
})
