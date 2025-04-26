import { DomainError } from '../domain-error'

export class CardDeletionError extends DomainError {
  constructor(cardId: string, message: string) {
    super(`Error deleting card ${cardId}: ${message}`)
    this.name = 'CardDeletionError'
  }
}
