import { describe, expect, it } from 'vitest'

import { DeckUpdateError } from '@/domain/errors/deck/deck-update-error'
import { DomainError } from '@/domain/errors/domain-error'

describe('DeckUpdateError', () => {
  it('should set the correct error message and name without cause', () => {
    const deckId = 'deck-123'
    const userId = 'user-456'

    const error = new DeckUpdateError(deckId, userId)

    expect(error.message).toBe(
      `Failed to update deck with ID ${deckId} for user ${userId}`,
    )
    expect(error.name).toBe('DeckUpdateError')
    expect(error).toBeInstanceOf(DomainError)
  })

  it('should set the correct error message with cause', () => {
    const deckId = 'deck-123'
    const userId = 'user-456'
    const cause = new Error('Invalid data')

    const error = new DeckUpdateError(deckId, userId, cause)

    expect(error.message).toBe(
      `Failed to update deck with ID ${deckId} for user ${userId}: ${cause.message}`,
    )
    expect(error.name).toBe('DeckUpdateError')
    expect(error.cause).toBe(cause)
  })
})
