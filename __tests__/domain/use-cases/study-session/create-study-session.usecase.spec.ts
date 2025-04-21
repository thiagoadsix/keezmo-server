/* eslint-disable import/order */
import { mockStudySessionRepository } from '../../../@support/mocks/study-session-repository.mock'
/* eslint-enable import/order */

import { describe, expect, it, beforeEach, vi } from 'vitest'

import { StudySession } from '@/domain/entities/study-session'
import { StudySessionValidationError } from '@/domain/errors/study-session/study-session-validation-error'
import { CreateStudySessionUseCase } from '@/domain/use-cases/study-session/create-study-session.usecase'

describe('CreateStudySessionUseCase', () => {
  let useCase: CreateStudySessionUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    useCase = new CreateStudySessionUseCase(mockStudySessionRepository)
  })

  describe('Unit Tests', () => {
    it('should create a flashcard study session', async () => {
      const request = {
        deckId: 'deck-123',
        studyType: 'flashcard' as const,
        totalQuestions: 10,
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T10:30:00Z',
        ratings: [
          { questionId: 'question-1', rating: 'easy' },
          { questionId: 'question-2', rating: 'hard' },
        ],
      }

      await useCase.execute(request)

      expect(mockStudySessionRepository.save).toHaveBeenCalledTimes(1)

      const savedSession = mockStudySessionRepository.save.mock.calls[0][0]
      expect(savedSession).toBeInstanceOf(StudySession)
      expect(savedSession.deckId).toBe(request.deckId)
      expect(savedSession.studyType).toBe(request.studyType)
      expect(savedSession.ratings).toHaveLength(2)
    })

    it('should create a multiple choice study session', async () => {
      const request = {
        deckId: 'deck-123',
        studyType: 'multiple_choice' as const,
        totalQuestions: 10,
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T10:30:00Z',
        hits: 8,
        misses: 2,
        questionsMetadata: [
          {
            questionId: 'question-1',
            attempts: 1,
            consecutiveHits: 1,
            errors: 0,
          },
          {
            questionId: 'question-2',
            attempts: 2,
            consecutiveHits: 0,
            errors: 1,
          },
        ],
      }

      await useCase.execute(request)

      expect(mockStudySessionRepository.save).toHaveBeenCalledTimes(1)

      const savedSession = mockStudySessionRepository.save.mock.calls[0][0]
      expect(savedSession).toBeInstanceOf(StudySession)
      expect(savedSession.deckId).toBe(request.deckId)
      expect(savedSession.studyType).toBe(request.studyType)
      expect(savedSession.hits).toBe(request.hits)
      expect(savedSession.misses).toBe(request.misses)
      expect(savedSession.questionsMetadata).toHaveLength(2)
    })

    it('should create a multiple choice study session with default hits and misses', async () => {
      const request = {
        deckId: 'deck-123',
        studyType: 'multiple_choice' as const,
        totalQuestions: 10,
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T10:30:00Z',
      }

      await useCase.execute(request)

      expect(mockStudySessionRepository.save).toHaveBeenCalledTimes(1)

      const savedSession = mockStudySessionRepository.save.mock.calls[0][0]
      expect(savedSession.hits).toBe(0)
      expect(savedSession.misses).toBe(0)
    })

    it('should throw an error if repository fails', async () => {
      const request = {
        deckId: 'deck-123',
        studyType: 'flashcard' as const,
        totalQuestions: 10,
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T10:30:00Z',
      }

      const error = new Error('Repository error')
      mockStudySessionRepository.save.mockRejectedValueOnce(error)

      await expect(useCase.execute(request)).rejects.toThrow('Repository error')
    })
  })

  describe('BDD Scenarios', () => {
    it('Given valid flashcard study session data, When execute is called, Then repository save is invoked with correct data', async () => {
      const request = {
        deckId: 'deck-123',
        studyType: 'flashcard' as const,
        totalQuestions: 10,
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T10:30:00Z',
        ratings: [{ questionId: 'question-1', rating: 'easy' }],
      }

      await useCase.execute(request)

      expect(mockStudySessionRepository.save).toHaveBeenCalledTimes(1)
      const savedSession = mockStudySessionRepository.save.mock.calls[0][0]
      expect(savedSession.deckId).toBe(request.deckId)
      expect(savedSession.studyType).toBe('flashcard')
      expect(savedSession.ratings).toHaveLength(1)
      expect(savedSession.ratings[0].questionId).toBe('question-1')
    })

    it('Given valid multiple choice study session data, When execute is called, Then repository save is invoked with correct data', async () => {
      const request = {
        deckId: 'deck-123',
        studyType: 'multiple_choice' as const,
        totalQuestions: 10,
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T10:30:00Z',
        hits: 7,
        misses: 3,
      }

      await useCase.execute(request)

      expect(mockStudySessionRepository.save).toHaveBeenCalledTimes(1)
      const savedSession = mockStudySessionRepository.save.mock.calls[0][0]
      expect(savedSession.deckId).toBe(request.deckId)
      expect(savedSession.studyType).toBe('multiple_choice')
      expect(savedSession.hits).toBe(7)
      expect(savedSession.misses).toBe(3)
    })

    it('Given invalid study data with no deckId, When execute is called, Then it throws StudySessionValidationError', async () => {
      const request = {
        deckId: '',
        studyType: 'flashcard' as const,
        totalQuestions: 10,
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T10:30:00Z',
      }

      await expect(useCase.execute(request)).rejects.toThrow(
        StudySessionValidationError,
      )
    })
  })
})
