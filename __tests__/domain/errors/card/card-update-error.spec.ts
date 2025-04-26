import { describe, expect, it } from 'vitest'

import { CardUpdateError } from '@/domain/errors/card/card-update-error'
import { DomainError } from '@/domain/errors/domain-error'

describe('CardUpdateError', () => {
  it('should set the correct error message, name, and cause', () => {
    const cardId = 'card-123'
    const deckId = 'deck-456'
    const originalError = new Error('Something went wrong')

    const error = new CardUpdateError(cardId, deckId, originalError)

    expect(error.message).toBe(
      `Failed to update card ${cardId} in deck ${deckId}: ${originalError.message}`,
    )
    expect(error.name).toBe('CardUpdateError')
    expect(error.cause).toBe(originalError)
    expect(error).toBeInstanceOf(DomainError)
  })
})
