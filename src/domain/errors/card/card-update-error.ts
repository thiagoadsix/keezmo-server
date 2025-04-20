import { DomainError } from '../domain-error'

export class CardUpdateError extends DomainError {
  constructor(cardId: string, deckId: string, cause?: Error) {
    super(
      `Failed to update card with ID ${cardId} in deck ${deckId}${cause ? `: ${cause.message}` : ''}`,
    )
    this.name = 'CardUpdateError'
    if (cause) {
      this.cause = cause
    }
  }
}
