import { DomainError } from '../domain-error'

export class InvalidDeckTitleError extends DomainError {
  constructor(title: string) {
    super(`The deck title "${title}" is invalid.`)
    this.name = 'InvalidDeckTitleError'
  }
}
