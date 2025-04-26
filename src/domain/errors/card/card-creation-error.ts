import { DomainError } from '../domain-error'

export class CardCreationError extends DomainError {
  constructor(message: string = 'Failed to create card') {
    super(message)
    this.name = 'CardCreationError'
  }
}
