import { DomainError } from '../domain-error'

export class InvalidQuestionMetadataError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidQuestionMetadataError'
  }
}
