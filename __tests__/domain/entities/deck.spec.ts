/* eslint-disable import/order */
import {
  mockId,
  generateIdMock,
} from '../../@support/mocks/shared/utils/generate-id.mock'
/* eslint-enable import/order */

import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import { Card } from '@/domain/entities/card'
import { Deck } from '@/domain/entities/deck'
import { InvalidDeckDescriptionError } from '@/domain/errors/deck/invalid-deck-description-error'
import { InvalidDeckTitleError } from '@/domain/errors/deck/invalid-deck-title-error'
import { StudyMode } from '@/domain/value-objects'

import { validCardProps } from '../../@support/fixtures/card.fixtures'
import {
  validDeckProps,
  validFlashcardDeckProps,
  validDeckWithCardsProps,
  invalidDeckPropsWithEmptyTitle,
  invalidDeckPropsWithNullDescription,
} from '../../@support/fixtures/deck.fixtures'

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
      expect(deck.userId).toBe(validDeckProps.userId)
      expect(deck.title).toBe(validDeckProps.title)
      expect(deck.description).toBe(validDeckProps.description)
      expect(deck.studyMode).toBe(validDeckProps.studyMode)
      expect(deck.cards).toEqual([])
      expect(deck.createdAt).toBe(expectedDateString)
      expect(deck.updatedAt).toBe(expectedDateString)
    })

    it('should create a Deck with cards when provided', () => {
      const deck = new Deck(validDeckWithCardsProps)

      expect(deck.cards).toHaveLength(2)
      expect(deck.cards[0]).toBeInstanceOf(Card)
      expect(deck.cards[0].id).toBeDefined()
      expect(deck.cards[1].id).toBeDefined()
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
      const newStudyMode = new StudyMode('multiple_choice')
      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      deck.updateStudyMode(newStudyMode)

      expect(deck.studyMode).toBe(newStudyMode)
      expect(deck.updatedAt).toBe(expectedDateString)
    })
  })

  describe('card management methods', () => {
    it('should add a card to the deck', () => {
      const deck = new Deck(validDeckProps)
      const card = new Card({
        ...validCardProps,
        deckId: deck.id,
      })
      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      deck.addCard(card)

      expect(deck.cards).toHaveLength(1)
      expect(deck.cards[0]).toBe(card)
      expect(deck.updatedAt).toBe(expectedDateString)
    })

    it('should remove a card from the deck', () => {
      const deck = new Deck(validDeckProps)

      const card1 = new Card({
        deckId: deck.id,
        question: 'Question 1',
        answer: 'Answer 1',
      })

      const card2 = new Card({
        deckId: deck.id,
        question: 'Question 2',
        answer: 'Answer 2',
      })

      Object.defineProperty(card1, 'id', { value: 'card-id-1' })
      Object.defineProperty(card2, 'id', { value: 'card-id-2' })

      deck.addCard(card1)
      deck.addCard(card2)

      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      expect(deck.cards).toHaveLength(2)
      expect(deck.cards[0].id).toBe('card-id-1')
      expect(deck.cards[1].id).toBe('card-id-2')

      deck.removeCard('card-id-1')

      expect(deck.cards).toHaveLength(1)
      expect(deck.cards[0].id).toBe('card-id-2')
      expect(deck.updatedAt).toBe(expectedDateString)
    })

    it('should find a card by id', () => {
      const deck = new Deck(validDeckWithCardsProps)

      const foundCard = deck.getCardById(deck.cards[0].id)

      expect(foundCard).toBeDefined()
      expect(foundCard?.id).toBeDefined()
      expect(foundCard?.question).toBe('What is the capital of France?')
    })

    it('should return undefined when card is not found', () => {
      const deck = new Deck(validDeckWithCardsProps)

      const foundCard = deck.getCardById('non-existent-id')

      expect(foundCard).toBeUndefined()
    })
  })
})
