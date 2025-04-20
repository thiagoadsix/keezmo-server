import { DomainError } from '../domain-error'

export class DeckDeletionError extends DomainError {
  constructor(deckId: string, userId: string, cause?: Error) {
    super(
      `Failed to delete deck with ID ${deckId} for user ${userId}${cause ? `: ${cause.message}` : ''}`,
    )
    this.name = 'DeckDeletionError'
    if (cause) {
      this.cause = cause
    }
  }
}
