import { DomainError } from '../domain-error'

export class InvalidCardQuestionError extends DomainError {
  constructor(question: string) {
    super(`The card question "${question}" is invalid.`)
    this.name = 'InvalidCardQuestionError'
  }
}
