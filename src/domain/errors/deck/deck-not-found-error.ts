import { DomainError } from '../domain-error'

export class DeckNotFoundError extends DomainError {
  constructor(deckId: string, userId: string) {
    super(`Deck with ID ${deckId} not found for user ${userId}`)
    this.name = 'DeckNotFoundError'
  }
}
