/* eslint-disable import/order */
import {
  mockId,
  generateIdMock,
} from '../../../@support/mocks/generate-id.mock'
import { mockDeckRepository } from '../../../@support/mocks/deck-repository.mock'
/* eslint-enable import/order */

import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import { Card } from '@/domain/entities/card'
import { CreateDeckUseCase } from '@/domain/use-cases/deck/create-deck.usecase'
import { StudyModeEnum } from '@/domain/value-objects'

import { validCardProps } from '../../../@support/fixtures/card.fixtures'
import { validDeckProps } from '../../../@support/fixtures/deck.fixtures'

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
        studyMode: StudyModeEnum.FLASHCARD,
      }

      await useCase.execute(request)

      expect(mockDeckRepository.save).toHaveBeenCalledTimes(1)
      const savedDeck = mockDeckRepository.save.mock.calls[0][0]
      expect(savedDeck.id).toBe(mockId)
      expect(savedDeck.userId).toBe(userId)
      expect(savedDeck.title).toBe(request.title)
      expect(savedDeck.description).toBe(request.description)
      expect(savedDeck.studyMode.getValue()).toBe('flashcard')
      expect(savedDeck.cards).toEqual([])
    })

    it('should create a deck with cards successfully', async () => {
      const request = {
        userId,
        title: validDeckProps.title,
        description: validDeckProps.description,
        studyMode: StudyModeEnum.MULTIPLE_CHOICE,
        cards: [
          {
            question: validCardProps.question,
            answer: validCardProps.answer,
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
      expect(savedDeck.studyMode.getValue()).toBe('multiple_choice')
      expect(savedDeck.cards).toHaveLength(2)
      expect(savedDeck.cards[0]).toBeInstanceOf(Card)
      expect(savedDeck.cards[0].question).toBe(request.cards[0].question)
      expect(savedDeck.cards[0].answer).toBe(request.cards[0].answer)
      expect(savedDeck.cards[1].question).toBe(request.cards[1].question)
      expect(savedDeck.cards[1].answer).toBe(request.cards[1].answer)
    })

    it('should propagate errors from repository', async () => {
      const request = {
        userId,
        title: validDeckProps.title,
        description: validDeckProps.description,
        studyMode: StudyModeEnum.FLASHCARD,
      }

      const repoError = new Error('Database connection failed')
      mockDeckRepository.save.mockRejectedValueOnce(repoError)

      await expect(useCase.execute(request)).rejects.toThrow(repoError)
    })
  })

  describe('BDD Scenarios', () => {
    it('Given valid deck data, When execute is called, Then repository save is invoked with correct deck', async () => {
      const request = {
        userId,
        title: 'Advanced Physics',
        description: 'Physics concepts for advanced students',
        studyMode: StudyModeEnum.FLASHCARD,
      }

      await useCase.execute(request)

      expect(mockDeckRepository.save).toHaveBeenCalledTimes(1)
      const savedDeck = mockDeckRepository.save.mock.calls[0][0]
      expect(savedDeck.userId).toBe(userId)
      expect(savedDeck.title).toBe(request.title)
      expect(savedDeck.description).toBe(request.description)
      expect(savedDeck.studyMode.getValue()).toBe('flashcard')
    })

    it('Given deck data with 2 cards, When execute is called, Then deck contains exactly 2 cards with matching content', async () => {
      const request = {
        userId,
        title: 'Geography Quiz',
        description: 'Test your geography knowledge',
        studyMode: StudyModeEnum.MULTIPLE_CHOICE,
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

      await useCase.execute(request)

      const savedDeck = mockDeckRepository.save.mock.calls[0][0]
      expect(savedDeck.userId).toBe(userId)
      expect(savedDeck.cards).toHaveLength(2)
      expect(savedDeck.cards[0].question).toBe(request.cards[0].question)
      expect(savedDeck.cards[0].answer).toBe(request.cards[0].answer)
      expect(savedDeck.cards[1].question).toBe(request.cards[1].question)
      expect(savedDeck.cards[1].answer).toBe(request.cards[1].answer)
    })

    it('Given missing title, When execute is called, Then promise rejects with InvalidDeckTitleError', async () => {
      const request = {
        userId,
        title: '',
        description: validDeckProps.description,
        studyMode: StudyModeEnum.FLASHCARD,
      }

      await expect(useCase.execute(request)).rejects.toThrow()
      expect(mockDeckRepository.save).not.toHaveBeenCalled()
    })

    it('Given invalid card data, When execute is called, Then promise rejects with error', async () => {
      const request = {
        userId,
        title: validDeckProps.title,
        description: validDeckProps.description,
        studyMode: StudyModeEnum.FLASHCARD,
        cards: [
          {
            question: '',
            answer: validCardProps.answer,
          },
        ],
      }

      await expect(useCase.execute(request)).rejects.toThrow()
      expect(mockDeckRepository.save).not.toHaveBeenCalled()
    })
  })
})
