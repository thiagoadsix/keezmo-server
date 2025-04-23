#!/usr/bin/env tsx
import { spawnSync } from 'node:child_process'

import chalk from 'chalk'
import prompts from 'prompts'

const scopes = {
  entities: '__tests__/domain/entities',
  usecases: '__tests__/domain/use-cases',
  errors: '__tests__/domain/errors',
  valueobjects: '__tests__/domain/value-objects',
  shared: '__tests__/shared',
  all: '__tests__',
} as const

;(async () => {
  const [, , rawScope, ...extraArgs] = process.argv
  let targetDir: string | undefined =
    rawScope && scopes[rawScope.toLowerCase() as keyof typeof scopes]

  const showHelp = () => {
    console.log('\n🚧  ' + chalk.yellow('Escopos disponíveis:'))
    Object.keys(scopes).forEach((k) => console.log('  • ' + chalk.cyan(k)))
    console.log(`\nEx.: ${chalk.green('pnpm test:scope entities')}\n`)
  }

  if (!targetDir) {
    const { value } = await prompts({
      type: 'select',
      name: 'value',
      message: 'Qual escopo deseja testar?',
      choices: Object.entries(scopes).map(([k, v]) => ({ title: k, value: v })),
      initial: 0,
    })
    targetDir = value ?? scopes.all
  }

  if (!targetDir) {
    showHelp()
    process.exit(0)
  }

  const { status } = spawnSync(
    'vitest',
    ['run', targetDir, '--silent', ...extraArgs],
    { stdio: 'inherit' },
  )
  process.exit(status ?? 1)
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
