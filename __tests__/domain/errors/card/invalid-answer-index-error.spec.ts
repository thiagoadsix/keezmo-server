import { describe, expect, it } from 'vitest'

import { InvalidAnswerIndexError } from '@/domain/errors/card/invalid-answer-index-error'
import { DomainError } from '@/domain/errors/domain-error'

describe('InvalidAnswerIndexError', () => {
  it('should extend DomainError', () => {
    const error = new InvalidAnswerIndexError(5, 4)
    expect(error).toBeInstanceOf(DomainError)
  })

  it('should set the correct error message and name', () => {
    const invalidIndex = 5
    const optionsLength = 4
    const error = new InvalidAnswerIndexError(invalidIndex, optionsLength)

    expect(error.message).toBe(
      `The answer index ${invalidIndex} is invalid. It must be between 0 and ${optionsLength - 1}.`,
    )
    expect(error.name).toBe('InvalidAnswerIndexError')
  })
})
