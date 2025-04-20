import { DomainError } from '../domain-error'

export class DeckUpdateError extends DomainError {
  constructor(deckId: string, userId: string, cause?: Error) {
    super(
      `Failed to update deck with ID ${deckId} for user ${userId}${cause ? `: ${cause.message}` : ''}`,
    )
    this.name = 'DeckUpdateError'
    if (cause) {
      this.cause = cause
    }
  }
}
