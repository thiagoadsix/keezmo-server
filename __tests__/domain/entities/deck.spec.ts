/* eslint-disable import/order */
import { mockId, generateIdMock } from '../../mocks/generate-id.mock'
/* eslint-enable import/order */

import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import { Card } from '@/domain/entities/card'
import { Deck } from '@/domain/entities/deck'
import { InvalidDeckDescriptionError } from '@/domain/errors/deck/invalid-deck-description-error'
import { InvalidDeckTitleError } from '@/domain/errors/deck/invalid-deck-title-error'
import { DeckType } from '@/domain/value-objects'

import { validCardProps } from '../../fixtures/card.fixtures'
import {
  validDeckProps,
  validFlashcardDeckProps,
  validDeckWithCardsProps,
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
      expect(deck.userId).toBe(validDeckProps.userId)
      expect(deck.title).toBe(validDeckProps.title)
      expect(deck.description).toBe(validDeckProps.description)
      expect(deck.type).toBe(validDeckProps.type)
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
      const newType = new DeckType('multiple_choice')
      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      deck.updateType(newType)

      expect(deck.type).toBe(newType)
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
    // WARNING: since we are mocking generateIdMock we should be careful to not generate the same ID for all entities. We should fix it ASAP.
    it('should remove a card from the deck', () => {
      // Create a fresh deck without cards
      const deck = new Deck(validDeckProps)

      // Create cards with manually assigned IDs instead of using generateId
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

      // Manually set card IDs to ensure they're unique
      Object.defineProperty(card1, 'id', { value: 'card-id-1' })
      Object.defineProperty(card2, 'id', { value: 'card-id-2' })

      // Add cards to the deck
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
