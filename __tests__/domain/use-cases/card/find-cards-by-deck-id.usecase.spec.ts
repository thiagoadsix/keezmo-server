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
import { DeckNotFoundError } from '@/domain/errors/deck/deck-not-found-error'
import { FindCardsByDeckIdUseCase } from '@/domain/use-cases/card/find-cards-by-deck-id.usecase'

import {
  validDeckProps,
  validDeckWithCardsProps,
} from '../../../@support/fixtures/deck.fixtures'

describe('FindCardsByDeckIdUseCase', () => {
  let useCase: FindCardsByDeckIdUseCase
  let mockDeck: Deck
  let mockDeckWithCards: Deck
  let mockCards: Card[]

  beforeEach(() => {
    useCase = new FindCardsByDeckIdUseCase(
      mockCardRepository,
      mockDeckRepository,
    )
    vi.useFakeTimers()
    generateIdMock.mockReturnValue(mockId)

    mockDeck = new Deck(validDeckProps)
    mockDeckWithCards = new Deck(validDeckWithCardsProps)
    mockCards = mockDeckWithCards.cards

    mockDeckRepository.findById.mockResolvedValue(mockDeck)
    mockCardRepository.findByDeckId.mockResolvedValue(mockCards)

    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  describe('Unit Tests', () => {
    it('should fetch cards from repository when deck exists', async () => {
      const request = { deckId: mockId }

      const result = await useCase.execute(request)

      expect(mockDeckRepository.findById).toHaveBeenCalledWith(mockId)
      expect(mockCardRepository.findByDeckId).toHaveBeenCalledWith(mockId)
      expect(result).toEqual(mockCards)
      expect(result).toHaveLength(mockCards.length)
    })

    it('should throw DeckNotFoundError when deck is not found', async () => {
      const request = { deckId: mockId }
      mockDeckRepository.findById.mockResolvedValue(null)

      await expect(useCase.execute(request)).rejects.toThrow(DeckNotFoundError)
      expect(mockCardRepository.findByDeckId).not.toHaveBeenCalled()
    })

    it('should propagate repository errors', async () => {
      const request = { deckId: mockId }
      const repoError = new Error('Repository error')
      mockCardRepository.findByDeckId.mockRejectedValueOnce(repoError)

      await expect(useCase.execute(request)).rejects.toThrow(repoError)
    })
  })

  describe('BDD Scenarios', () => {
    it('Given an existing deck, When execute is called, Then fetch cards from repository', async () => {
      // Given
      const request = { deckId: mockId }

      // When
      const result = await useCase.execute(request)

      // Then
      expect(mockDeckRepository.findById).toHaveBeenCalledWith(request.deckId)
      expect(mockCardRepository.findByDeckId).toHaveBeenCalledWith(
        request.deckId,
      )
      expect(result).toEqual(mockCards)
    })

    it('Given a non-existent deck, When execute is called, Then throw DeckNotFoundError', async () => {
      // Given
      const request = { deckId: 'non-existent-id' }
      mockDeckRepository.findById.mockResolvedValue(null)

      // When / Then
      await expect(useCase.execute(request)).rejects.toThrow(DeckNotFoundError)
    })

    it('Given a repository error, When execute is called, Then propagate the error', async () => {
      // Given
      const request = { deckId: mockId }
      const error = new Error('Database connection failed')
      mockCardRepository.findByDeckId.mockRejectedValueOnce(error)

      // When / Then
      await expect(useCase.execute(request)).rejects.toThrow(error)
    })
  })
})
