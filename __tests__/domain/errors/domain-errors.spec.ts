import { describe, expect, it } from 'vitest'

import { DomainError } from '@/domain/errors/domain-error'
import { InvalidDeckDescriptionError } from '@/domain/errors/invalid-deck-description-error'
import { InvalidDeckTitleError } from '@/domain/errors/invalid-deck-title-error'
import { InvalidDeckTypeError } from '@/domain/errors/invalid-deck-type-error'

describe('Domain Errors', () => {
  describe('DomainError', () => {
    it('should be an abstract class extending Error', () => {
      const error = new InvalidDeckTitleError('test')

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(DomainError)
    })
  })

  describe('InvalidDeckTitleError', () => {
    it('should set the correct error message and name', () => {
      const invalidTitle = ''

      const error = new InvalidDeckTitleError(invalidTitle)

      expect(error.message).toBe(`The deck title "${invalidTitle}" is invalid.`)
      expect(error.name).toBe('InvalidDeckTitleError')
    })
  })

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

  describe('InvalidDeckDescriptionError', () => {
    it('should set the correct error message and name', () => {
      const invalidDescription = 'null'

      const error = new InvalidDeckDescriptionError(invalidDescription)

      expect(error.message).toBe(
        `The deck description "${invalidDescription}" is invalid.`,
      )
      expect(error.name).toBe('InvalidDeckDescriptionError')
    })
  })
})
