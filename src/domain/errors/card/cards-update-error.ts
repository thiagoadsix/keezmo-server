import { DomainError } from '../domain-error'

export class CardsUpdateError extends DomainError {
  constructor(deckId: string, cause?: Error) {
    super(
      `Failed to update cards in deck ${deckId}${cause ? `: ${cause.message}` : ''}`,
    )
    this.name = 'CardsUpdateError'
    if (cause) {
      this.cause = cause
    }
  }
}
