import { describe, expect, it } from 'vitest'

import { CardNotFoundError } from '@/domain/errors/card/card-not-found-error'
import { DomainError } from '@/domain/errors/domain-error'

describe('CardNotFoundError', () => {
  it('should set the correct error message and name', () => {
    const cardId = 'card-123'
    const deckId = 'deck-456'

    const error = new CardNotFoundError(cardId, deckId)

    expect(error.message).toBe(
      `Card with ID ${cardId} not found in deck ${deckId}`,
    )
    expect(error.name).toBe('CardNotFoundError')
    expect(error).toBeInstanceOf(DomainError)
  })
})
