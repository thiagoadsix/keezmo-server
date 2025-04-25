/* eslint-disable import/order */
import {
  mockId,
  generateIdMock,
} from '../../../@support/mocks/generate-id.mock'
import { mockDeckRepository } from '../../../@support/mocks/deck-repository.mock'
import { mockCardRepository } from '../../../@support/mocks/card-repository.mock'
/* eslint-enable import/order */

import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import { Card } from '@/domain/entities/card'
import { Deck } from '@/domain/entities/deck'
import { CardNotFoundError } from '@/domain/errors/card/card-not-found-error'
import { CardUpdateError } from '@/domain/errors/card/card-update-error'
import { DeckNotFoundError } from '@/domain/errors/deck/deck-not-found-error'
import { UpdateCardUseCase } from '@/domain/use-cases/card/update-card.usecase'

import { validDeckProps } from '../../../@support/fixtures/deck.fixtures'

describe('UpdateCardUseCase', () => {
  let useCase: UpdateCardUseCase
  let mockDeck: Deck
  let mockCard: Card
  const deckId = mockId
  const cardId = 'card-1'

  beforeEach(() => {
    vi.useFakeTimers()
    generateIdMock.mockReturnValue(mockId)

    // Create mock instances
    useCase = new UpdateCardUseCase(mockCardRepository, mockDeckRepository)
    mockDeck = new Deck(validDeckProps)

    // Create mock card with predetermined ID
    mockCard = Object.assign(
      new Card({
        deckId: mockId,
        question: 'What is the capital of France?',
        answer: 'Paris',
      }),
      { id: cardId },
    )

    // Mock repository responses
    mockDeckRepository.findById.mockResolvedValue(mockDeck)
    mockCardRepository.findById.mockResolvedValue(mockCard)
    mockCardRepository.save.mockResolvedValue(undefined)

    vi.clearAllMocks()

    // Set up spies on card methods after clearAllMocks
    vi.spyOn(mockCard, 'updateQuestion')
    vi.spyOn(mockCard, 'updateAnswer')
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  describe('Unit Tests', () => {
    it('should update card question when it exists in the deck', async () => {
      const request = {
        deckId,
        cardId,
        data: {
          question: 'Updated question',
        },
      }

      const result = await useCase.execute(request)

      expect(mockDeckRepository.findById).toHaveBeenCalledWith(deckId)
      expect(mockCardRepository.findById).toHaveBeenCalledWith(cardId)
      expect(mockCard.updateQuestion).toHaveBeenCalledWith('Updated question')
      expect(mockCard.updateAnswer).not.toHaveBeenCalled()
      expect(mockCardRepository.save).toHaveBeenCalledWith(mockCard)
      expect(result).toBe(mockCard)
    })

    it('should update card answer when it exists in the deck', async () => {
      const request = {
        deckId,
        cardId,
        data: {
          answer: 'Updated answer',
        },
      }

      const result = await useCase.execute(request)

      expect(mockCard.updateQuestion).not.toHaveBeenCalled()
      expect(mockCard.updateAnswer).toHaveBeenCalledWith('Updated answer')
      expect(mockCardRepository.save).toHaveBeenCalledWith(mockCard)
      expect(result).toBe(mockCard)
    })

    it('should update multiple fields when provided together', async () => {
      const request = {
        deckId,
        cardId,
        data: {
          question: 'New question',
          answer: 'New answer',
        },
      }

      await useCase.execute(request)

      expect(mockCard.updateQuestion).toHaveBeenCalledWith('New question')
      expect(mockCard.updateAnswer).toHaveBeenCalledWith('New answer')
      expect(mockCardRepository.save).toHaveBeenCalledWith(mockCard)
    })

    it('should throw DeckNotFoundError when deck is not found', async () => {
      mockDeckRepository.findById.mockResolvedValueOnce(null)

      const request = {
        deckId,
        cardId,
        data: {
          question: 'Updated question',
        },
      }

      await expect(useCase.execute(request)).rejects.toThrow(DeckNotFoundError)
      expect(mockCardRepository.findById).not.toHaveBeenCalled()
      expect(mockCardRepository.save).not.toHaveBeenCalled()
    })

    it('should throw CardNotFoundError when card is not found', async () => {
      mockCardRepository.findById.mockResolvedValueOnce(null)

      const request = {
        deckId,
        cardId,
        data: {
          question: 'Updated question',
        },
      }

      await expect(useCase.execute(request)).rejects.toThrow(CardNotFoundError)
      expect(mockCardRepository.save).not.toHaveBeenCalled()
    })

    it('should throw CardNotFoundError when card belongs to different deck', async () => {
      const differentDeckCard = Object.assign(
        new Card({
          deckId: 'different-deck-id',
          question: 'Question',
          answer: 'Answer',
        }),
        { id: cardId },
      )

      mockCardRepository.findById.mockResolvedValueOnce(differentDeckCard)

      const request = {
        deckId,
        cardId,
        data: {
          question: 'Updated question',
        },
      }

      await expect(useCase.execute(request)).rejects.toThrow(CardNotFoundError)
      expect(mockCardRepository.save).not.toHaveBeenCalled()
    })

    it('should throw CardUpdateError when save fails', async () => {
      const saveError = new Error('Database error')
      mockCardRepository.save.mockRejectedValueOnce(saveError)

      const request = {
        deckId,
        cardId,
        data: {
          question: 'Updated question',
        },
      }

      await expect(useCase.execute(request)).rejects.toThrow(CardUpdateError)
    })
  })

  describe('BDD Scenarios', () => {
    it('Given a valid card in a deck, When execute is called with card updates, Then the card is updated', async () => {
      // Given
      const request = {
        deckId,
        cardId,
        data: {
          question: 'New question',
          answer: 'New answer',
        },
      }

      // When
      const result = await useCase.execute(request)

      // Then
      expect(mockCard.updateQuestion).toHaveBeenCalledWith('New question')
      expect(mockCard.updateAnswer).toHaveBeenCalledWith('New answer')
      expect(mockCardRepository.save).toHaveBeenCalledWith(mockCard)
      expect(result).toBe(mockCard)
    })

    it('Given a non-existent deck, When execute is called, Then DeckNotFoundError is thrown', async () => {
      // Given
      mockDeckRepository.findById.mockResolvedValueOnce(null)

      const request = {
        deckId: 'non-existent-deck-id',
        cardId,
        data: {
          question: 'Updated',
        },
      }

      // When / Then
      await expect(useCase.execute(request)).rejects.toThrow(DeckNotFoundError)
    })

    it('Given a non-existent card, When execute is called, Then CardNotFoundError is thrown', async () => {
      // Given
      mockCardRepository.findById.mockResolvedValueOnce(null)

      const request = {
        deckId,
        cardId: 'non-existent-card-id',
        data: {
          question: 'Updated',
        },
      }

      // When / Then
      await expect(useCase.execute(request)).rejects.toThrow(CardNotFoundError)
    })

    it('Given a card from different deck, When execute is called, Then CardNotFoundError is thrown with deck mismatch', async () => {
      // Given
      const differentDeckCard = Object.assign(
        new Card({
          deckId: 'different-deck-id',
          question: 'Question',
          answer: 'Answer',
        }),
        { id: cardId },
      )

      mockCardRepository.findById.mockResolvedValueOnce(differentDeckCard)

      const request = {
        deckId,
        cardId,
        data: {
          question: 'Updated',
        },
      }

      // When / Then
      await expect(useCase.execute(request)).rejects.toThrow(CardNotFoundError)
    })
  })
})
