/* eslint-disable import/order */
import { mockId, generateIdMock } from '../../mocks/generate-id.mock'
/* eslint-enable import/order */

import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import { Deck } from '@/domain/entities/deck'
import { InvalidDeckDescriptionError } from '@/domain/errors/invalid-deck-description-error'
import { InvalidDeckTitleError } from '@/domain/errors/invalid-deck-title-error'
import { DeckType } from '@/domain/value-objects/deck-type'

import {
  validDeckProps,
  validFlashcardDeckProps,
  invalidDeckPropsWithEmptyTitle,
  invalidDeckPropsWithNullDescription,
} from '../../fixtures/deck.fixtures'

describe('Deck', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    generateIdMock.mockReturnValue(mockId)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  describe('constructor', () => {
    it('should create a valid Deck entity with provided properties', () => {
      const fixedDate = new Date('2023-01-01T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      const deck = new Deck(validDeckProps)

      expect(deck).toBeInstanceOf(Deck)
      expect(deck.id).toBe(mockId)
      expect(deck.title).toBe(validDeckProps.title)
      expect(deck.description).toBe(validDeckProps.description)
      expect(deck.type).toBe(validDeckProps.type)
      expect(deck.createdAt).toBe(expectedDateString)
      expect(deck.updatedAt).toBe(expectedDateString)
      expect(generateIdMock).toHaveBeenCalledTimes(1)
    })

    it('should create a Deck with specified createdAt and updatedAt', () => {
      const createdAt = '2023-01-01T10:00:00Z'
      const updatedAt = '2023-01-02T10:00:00Z'

      const deck = new Deck({
        ...validDeckProps,
        createdAt,
        updatedAt,
      })

      expect(deck.createdAt).toBe(createdAt)
      expect(deck.updatedAt).toBe(updatedAt)
    })

    it('should use createdAt as updatedAt when only createdAt is provided', () => {
      const createdAt = '2023-01-01T10:00:00Z'

      const deck = new Deck({
        ...validDeckProps,
        createdAt,
      })

      expect(deck.createdAt).toBe(createdAt)
      expect(deck.updatedAt).toBe(createdAt)
    })

    it('should throw InvalidDeckTitleError when title is empty', () => {
      expect(() => new Deck(invalidDeckPropsWithEmptyTitle)).toThrow(
        InvalidDeckTitleError,
      )
    })

    it('should throw InvalidDeckDescriptionError when description is null', () => {
      expect(() => new Deck(invalidDeckPropsWithNullDescription)).toThrow(
        InvalidDeckDescriptionError,
      )
    })
  })

  describe('updateTitle', () => {
    it('should update the title and updatedAt', () => {
      const deck = new Deck(validDeckProps)
      const newTitle = 'Updated Title'
      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      deck.updateTitle(newTitle)

      expect(deck.title).toBe(newTitle)
      expect(deck.updatedAt).toBe(expectedDateString)
    })

    it('should throw InvalidDeckTitleError when new title is empty', () => {
      const deck = new Deck(validDeckProps)

      expect(() => deck.updateTitle('')).toThrow(InvalidDeckTitleError)
    })
  })

  describe('updateDescription', () => {
    it('should update the description and updatedAt', () => {
      const deck = new Deck(validDeckProps)
      const newDescription = 'Updated description'
      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      deck.updateDescription(newDescription)

      expect(deck.description).toBe(newDescription)
      expect(deck.updatedAt).toBe(expectedDateString)
    })

    it('should throw InvalidDeckDescriptionError when new description is null', () => {
      const deck = new Deck(validDeckProps)

      expect(() => deck.updateDescription(null as unknown as string)).toThrow(
        InvalidDeckDescriptionError,
      )
    })
  })

  describe('updateType', () => {
    it('should update the type and updatedAt', () => {
      const deck = new Deck(validFlashcardDeckProps)
      const newType = new DeckType('multiple_choice')
      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      deck.updateType(newType)

      expect(deck.type).toBe(newType)
      expect(deck.updatedAt).toBe(expectedDateString)
    })
  })
})
