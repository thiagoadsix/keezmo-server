import { DomainError } from './domain-error'

export class InvalidDifficultyError extends DomainError {
  constructor(difficulty: string) {
    super(`The difficulty "${difficulty}" is invalid.`)
    this.name = 'InvalidDifficultyError'
  }
}
