import { describe, expect, it } from 'vitest'

import { InvalidDeckTypeError } from '@/domain/errors/deck/invalid-deck-type-error'
import { DeckType, DeckTypeEnum } from '@/domain/value-objects'

describe('DeckType', () => {
  describe('constructor', () => {
    it('should create a valid DeckType with flashcard type', () => {
      const deckType = new DeckType('flashcard')

      expect(deckType).toBeInstanceOf(DeckType)
      expect(deckType.getValue()).toBe(DeckTypeEnum.FLASHCARD)
    })

    it('should create a valid DeckType with multiple_choice type', () => {
      const deckType = new DeckType('multiple_choice')

      expect(deckType).toBeInstanceOf(DeckType)
      expect(deckType.getValue()).toBe(DeckTypeEnum.MULTIPLE_CHOICE)
    })

    it('should throw InvalidDeckTypeError for invalid type', () => {
      expect(() => new DeckType('invalid_type')).toThrow(InvalidDeckTypeError)
      expect(() => new DeckType('invalid_type')).toThrow(
        'The deck type "invalid_type" is invalid. Valid types are: flashcard, multiple_choice.',
      )
    })
  })

  describe('getValue', () => {
    it('should return the correct type value', () => {
      const flashcardType = new DeckType('flashcard')
      const multipleChoiceType = new DeckType('multiple_choice')

      expect(flashcardType.getValue()).toBe(DeckTypeEnum.FLASHCARD)
      expect(multipleChoiceType.getValue()).toBe(DeckTypeEnum.MULTIPLE_CHOICE)
    })
  })
})
