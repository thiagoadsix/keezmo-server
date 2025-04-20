/* eslint-disable import/order */
import { mockId, generateIdMock } from '../../../mocks/generate-id.mock'
import { mockDeckRepository } from '../../../mocks/deck-repository.mock'
/* eslint-enable import/order */

import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import { Card } from '@/domain/entities/card'
import { CreateDeckUseCase } from '@/domain/use-cases/deck/create-deck.usecase'

import { validCardProps } from '../../../fixtures/card.fixtures'
import { validDeckProps } from '../../../fixtures/deck.fixtures'

describe('CreateDeckUseCase', () => {
  let useCase: CreateDeckUseCase
  const userId = 'user-123'

  beforeEach(() => {
    useCase = new CreateDeckUseCase(mockDeckRepository)
    vi.useFakeTimers()
    generateIdMock.mockReturnValue(mockId)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  describe('Unit Tests', () => {
    it('should create a deck without cards successfully', async () => {
      const request = {
        userId,
        title: validDeckProps.title,
        description: validDeckProps.description,
        type: 'flashcard',
      }

      await useCase.execute(request)

      expect(mockDeckRepository.save).toHaveBeenCalledTimes(1)
      const savedDeck = mockDeckRepository.save.mock.calls[0][0]
      expect(savedDeck.id).toBe(mockId)
      expect(savedDeck.userId).toBe(userId)
      expect(savedDeck.title).toBe(request.title)
      expect(savedDeck.description).toBe(request.description)
      expect(savedDeck.type.getValue()).toBe('flashcard')
      expect(savedDeck.cards).toEqual([])
    })

    it('should create a deck with cards successfully', async () => {
      const request = {
        userId,
        title: validDeckProps.title,
        description: validDeckProps.description,
        type: 'multiple_choice',
        cards: [
          {
            question: validCardProps.question,
            answer: validCardProps.answer,
            options: ['London', 'Paris', 'Berlin', 'Madrid'],
            answerIndex: 1,
          },
          {
            question: 'What is the capital of Germany?',
            answer: 'Berlin',
          },
        ],
      }

      await useCase.execute(request)

      expect(mockDeckRepository.save).toHaveBeenCalledTimes(1)
      const savedDeck = mockDeckRepository.save.mock.calls[0][0]
      expect(savedDeck.id).toBe(mockId)
      expect(savedDeck.userId).toBe(userId)
      expect(savedDeck.title).toBe(request.title)
      expect(savedDeck.type.getValue()).toBe('multiple_choice')
      expect(savedDeck.cards).toHaveLength(2)
      expect(savedDeck.cards[0]).toBeInstanceOf(Card)
      expect(savedDeck.cards[0].question).toBe(request.cards[0].question)
      expect(savedDeck.cards[0].answer).toBe(request.cards[0].answer)
      expect(savedDeck.cards[0].options).toEqual(request.cards[0].options)
      expect(savedDeck.cards[0].answerIndex).toBe(request.cards[0].answerIndex)
      expect(savedDeck.cards[1].question).toBe(request.cards[1].question)
      expect(savedDeck.cards[1].answer).toBe(request.cards[1].answer)
    })

    it('should propagate errors from repository', async () => {
      const request = {
        userId,
        title: validDeckProps.title,
        description: validDeckProps.description,
        type: 'flashcard',
      }

      const repoError = new Error('Database connection failed')
      mockDeckRepository.save.mockRejectedValueOnce(repoError)

      await expect(useCase.execute(request)).rejects.toThrow(repoError)
    })
  })

  describe('BDD Scenarios', () => {
    it('Given valid deck data, When execute is called, Then repository save is invoked with correct deck', async () => {
      // Given
      const request = {
        userId,
        title: 'Advanced Physics',
        description: 'Physics concepts for advanced students',
        type: 'flashcard',
      }

      // When
      await useCase.execute(request)

      // Then
      expect(mockDeckRepository.save).toHaveBeenCalledTimes(1)
      const savedDeck = mockDeckRepository.save.mock.calls[0][0]
      expect(savedDeck.userId).toBe(userId)
      expect(savedDeck.title).toBe(request.title)
      expect(savedDeck.description).toBe(request.description)
      expect(savedDeck.type.getValue()).toBe('flashcard')
    })

    it('Given deck data with 2 cards, When execute is called, Then deck contains exactly 2 cards with matching content', async () => {
      // Given
      const request = {
        userId,
        title: 'Geography Quiz',
        description: 'Test your geography knowledge',
        type: 'multiple_choice',
        cards: [
          {
            question: 'What is the capital of Japan?',
            answer: 'Tokyo',
          },
          {
            question: 'What is the capital of Brazil?',
            answer: 'Brasília',
          },
        ],
      }

      // When
      await useCase.execute(request)

      // Then
      const savedDeck = mockDeckRepository.save.mock.calls[0][0]
      expect(savedDeck.userId).toBe(userId)
      expect(savedDeck.cards).toHaveLength(2)
      expect(savedDeck.cards[0].question).toBe(request.cards[0].question)
      expect(savedDeck.cards[0].answer).toBe(request.cards[0].answer)
      expect(savedDeck.cards[1].question).toBe(request.cards[1].question)
      expect(savedDeck.cards[1].answer).toBe(request.cards[1].answer)
    })

    it('Given missing title, When execute is called, Then promise rejects with InvalidDeckTitleError', async () => {
      // Given
      const request = {
        userId,
        title: '',
        description: validDeckProps.description,
        type: 'flashcard',
      }

      // When/Then
      await expect(useCase.execute(request)).rejects.toThrow()
      expect(mockDeckRepository.save).not.toHaveBeenCalled()
    })

    it('Given invalid card data, When execute is called, Then promise rejects with error', async () => {
      // Given
      const request = {
        userId,
        title: validDeckProps.title,
        description: validDeckProps.description,
        type: 'flashcard',
        cards: [
          {
            question: '',
            answer: validCardProps.answer,
          },
        ],
      }

      // When/Then
      await expect(useCase.execute(request)).rejects.toThrow()
      expect(mockDeckRepository.save).not.toHaveBeenCalled()
    })
  })
})
