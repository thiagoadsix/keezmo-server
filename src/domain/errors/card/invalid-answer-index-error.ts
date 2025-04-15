import { DomainError } from '../domain-error'

export class InvalidAnswerIndexError extends DomainError {
  constructor(index: number, optionsLength: number) {
    super(
      `The answer index ${index} is invalid. It must be between 0 and ${optionsLength - 1}.`,
    )
    this.name = 'InvalidAnswerIndexError'
  }
}
