import { describe, expect, it } from 'vitest'

import { InvalidDeckTypeError } from '@/domain/errors/deck/invalid-deck-type-error'

describe('InvalidDeckTypeError', () => {
  it('should set the correct error message and name', () => {
    const invalidType = 'invalid_type'

    const error = new InvalidDeckTypeError(invalidType)

    expect(error.message).toBe(
      `The deck type "${invalidType}" is invalid. Valid types are: flashcard, multiple_choice.`,
    )
    expect(error.name).toBe('InvalidDeckTypeError')
  })
})
