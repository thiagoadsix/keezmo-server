/* eslint-disable import/order */
import {
  mockId,
  generateIdMock,
} from '../../../@support/mocks/generate-id.mock'
/* eslint-enable import/order */

import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import { Deck } from '@/domain/entities/deck'
import { DeckDeletionError } from '@/domain/errors/deck/deck-deletion-error'
import { DeckNotFoundError } from '@/domain/errors/deck/deck-not-found-error'
import { DeleteDeckUseCase } from '@/domain/use-cases/deck/delete-deck.usecase'

import {
  validDeckProps,
  validDeckWithCardsProps,
} from '../../../@support/fixtures/deck.fixtures'
import { mockCardRepository } from '../../../@support/mocks/card-repository.mock'
import { mockDeckRepository } from '../../../@support/mocks/deck-repository.mock'

describe('DeleteDeckUseCase', () => {
  let useCase: DeleteDeckUseCase
  let mockDeck: Deck
  let mockDeckWithCards: Deck
  const userId = 'user-123'

  beforeEach(() => {
    useCase = new DeleteDeckUseCase(mockDeckRepository, mockCardRepository)
    vi.useFakeTimers()
    generateIdMock.mockReturnValue(mockId)

    mockDeck = new Deck(validDeckProps)
    mockDeckWithCards = new Deck(validDeckWithCardsProps)

    mockDeckRepository.findByIdAndUserId.mockResolvedValue(mockDeck)
    mockDeckRepository.delete.mockResolvedValue(undefined)
    mockCardRepository.deleteByIds.mockResolvedValue(undefined)

    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  describe('Unit Tests', () => {
    it('should delete a deck without cards', async () => {
      const request = { deckId: mockId, userId }

      await useCase.execute(request)

      expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(
        mockId,
        userId,
      )
      expect(mockCardRepository.deleteByIds).not.toHaveBeenCalled()
      expect(mockDeckRepository.delete).toHaveBeenCalledWith(mockId)
    })

    it('should delete a deck with its cards', async () => {
      const request = { deckId: mockId, userId }
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(mockDeckWithCards)

      const cardIds = mockDeckWithCards.cards.map((card) => card.id)

      await useCase.execute(request)

      expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(
        mockId,
        userId,
      )
      expect(mockCardRepository.deleteByIds).toHaveBeenCalledWith(cardIds)
      expect(mockDeckRepository.delete).toHaveBeenCalledWith(mockId)
    })

    it('should throw DeckNotFoundError when deck is not found', async () => {
      const request = { deckId: mockId, userId }
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(null)

      const promise = useCase.execute(request)

      await expect(promise).rejects.toThrow(DeckNotFoundError)
      await expect(promise).rejects.toThrow(
        `Deck with ID ${mockId} not found for user ${userId}`,
      )
      expect(mockCardRepository.deleteByIds).not.toHaveBeenCalled()
      expect(mockDeckRepository.delete).not.toHaveBeenCalled()
    })

    it('should throw DeckDeletionError when card deletion fails', async () => {
      const request = { deckId: mockId, userId }
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(mockDeckWithCards)

      const cardError = new Error('Failed to delete cards')
      mockCardRepository.deleteByIds.mockRejectedValueOnce(cardError)

      const promise = useCase.execute(request)

      await expect(promise).rejects.toThrow(DeckDeletionError)
      expect(mockDeckRepository.delete).not.toHaveBeenCalled()
    })

    it('should throw DeckDeletionError when deck deletion fails', async () => {
      const request = { deckId: mockId, userId }

      const deckError = new Error('Failed to delete deck')
      mockDeckRepository.delete.mockRejectedValueOnce(deckError)

      const promise = useCase.execute(request)

      await expect(promise).rejects.toThrow(DeckDeletionError)
    })
  })

  describe('BDD Scenarios', () => {
    it('Given a deck without cards, When execute is called, Then only the deck is deleted', async () => {
      // Given
      const request = { deckId: mockId, userId }

      // When
      await useCase.execute(request)

      // Then
      expect(mockCardRepository.deleteByIds).not.toHaveBeenCalled()
      expect(mockDeckRepository.delete).toHaveBeenCalledWith(mockId)
    })

    it('Given a deck with cards, When execute is called, Then both cards and deck are deleted', async () => {
      // Given
      const request = { deckId: mockId, userId }
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(mockDeckWithCards)

      // When
      await useCase.execute(request)

      // Then
      expect(mockCardRepository.deleteByIds).toHaveBeenCalledWith(
        mockDeckWithCards.cards.map((card) => card.id),
      )
      expect(mockDeckRepository.delete).toHaveBeenCalledWith(mockId)
    })

    it('Given a non-existent deck, When execute is called, Then DeckNotFoundError is thrown', async () => {
      // Given
      const request = { deckId: 'non-existent-id', userId }
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(null)

      // When / Then
      await expect(useCase.execute(request)).rejects.toThrow(DeckNotFoundError)
    })

    it('Given an error during card deletion, When execute is called, Then DeckDeletionError is thrown', async () => {
      // Given
      const request = { deckId: mockId, userId }
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(mockDeckWithCards)
      mockCardRepository.deleteByIds.mockRejectedValueOnce(
        new Error('Database error'),
      )

      // When / Then
      await expect(useCase.execute(request)).rejects.toThrow(DeckDeletionError)
    })
  })
})
