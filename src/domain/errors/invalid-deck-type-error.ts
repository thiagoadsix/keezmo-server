import { DomainError } from './domain-error'

export class InvalidDeckTypeError extends DomainError {
  constructor(type: string) {
    super(
      `The deck type "${type}" is invalid. Valid types are: flashcard, multiple_choice.`,
    )
    this.name = 'InvalidDeckTypeError'
  }
}
