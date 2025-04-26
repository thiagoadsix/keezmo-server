import { describe, expect, it } from 'vitest'

import { CardsUpdateError } from '@/domain/errors/card/cards-update-error'
import { DomainError } from '@/domain/errors/domain-error'

describe('CardsUpdateError', () => {
  it('should set the correct error message and name without cause', () => {
    const deckId = 'deck-123'

    const error = new CardsUpdateError(deckId)

    expect(error.message).toBe(`Failed to update cards in deck ${deckId}`)
    expect(error.name).toBe('CardsUpdateError')
    expect(error).toBeInstanceOf(DomainError)
  })

  it('should set the correct error message with cause', () => {
    const deckId = 'deck-123'
    const cause = new Error('Invalid card data')

    const error = new CardsUpdateError(deckId, cause)

    expect(error.message).toBe(
      `Failed to update cards in deck ${deckId}: ${cause.message}`,
    )
    expect(error.name).toBe('CardsUpdateError')
    expect(error.cause).toBe(cause)
  })
})
