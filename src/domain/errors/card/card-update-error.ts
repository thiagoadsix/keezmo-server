import { DomainError } from '../domain-error'

export class CardUpdateError extends DomainError {
  constructor(cardId: string, deckId: string, originalError: Error) {
    super(
      `Failed to update card ${cardId} in deck ${deckId}: ${originalError.message}`,
    )
    this.name = 'CardUpdateError'
    this.cause = originalError
  }
}
