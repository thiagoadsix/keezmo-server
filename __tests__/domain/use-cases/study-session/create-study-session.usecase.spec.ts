/* eslint-disable import/order */
import { mockStudySessionRepository } from '../../../@support/mocks/repositories/study-session-repository.mock'
/* eslint-enable import/order */

import { describe, expect, it, beforeEach, vi } from 'vitest'

import { StudySession } from '@/domain/entities/study-session'
import { StudySessionValidationError } from '@/domain/errors/study-session/study-session-validation-error'
import { CreateStudySessionUseCase } from '@/domain/use-cases/study-session/create-study-session.usecase'
import { StudyModeEnum } from '@/domain/value-objects'

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
        studyMode: StudyModeEnum.FLASHCARD,
        totalQuestions: 10,
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T10:30:00Z',
      }

      await useCase.execute(request)

      expect(mockStudySessionRepository.save).toHaveBeenCalledTimes(1)

      const savedSession = mockStudySessionRepository.save.mock.calls[0][0]
      expect(savedSession).toBeInstanceOf(StudySession)
      expect(savedSession.deckId).toBe(request.deckId)
      expect(savedSession.studyMode).toBe(StudyModeEnum.FLASHCARD)
    })

    it('should create a multiple choice study session', async () => {
      const request = {
        deckId: 'deck-123',
        studyMode: StudyModeEnum.MULTIPLE_CHOICE,
        totalQuestions: 10,
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T10:30:00Z',
      }

      await useCase.execute(request)

      expect(mockStudySessionRepository.save).toHaveBeenCalledTimes(1)

      const savedSession = mockStudySessionRepository.save.mock.calls[0][0]
      expect(savedSession).toBeInstanceOf(StudySession)
      expect(savedSession.deckId).toBe(request.deckId)
      expect(savedSession.studyMode).toBe(request.studyMode)
    })

    it('should create a multiple choice study session with default hits and misses', async () => {
      const request = {
        deckId: 'deck-123',
        studyMode: StudyModeEnum.MULTIPLE_CHOICE,
        totalQuestions: 10,
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T10:30:00Z',
      }

      await useCase.execute(request)

      expect(mockStudySessionRepository.save).toHaveBeenCalledTimes(1)
    })

    it('should throw an error if repository fails', async () => {
      const request = {
        deckId: 'deck-123',
        studyMode: StudyModeEnum.FLASHCARD,
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
        studyMode: StudyModeEnum.FLASHCARD,
        totalQuestions: 10,
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T10:30:00Z',
      }

      await useCase.execute(request)

      expect(mockStudySessionRepository.save).toHaveBeenCalledTimes(1)
      const savedSession = mockStudySessionRepository.save.mock.calls[0][0]
      expect(savedSession.deckId).toBe(request.deckId)
      expect(savedSession.studyMode).toBe(StudyModeEnum.FLASHCARD)
    })

    it('Given valid multiple choice study session data, When execute is called, Then repository save is invoked with correct data', async () => {
      const request = {
        deckId: 'deck-123',
        studyMode: StudyModeEnum.MULTIPLE_CHOICE,
        totalQuestions: 10,
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T10:30:00Z',
      }

      await useCase.execute(request)

      expect(mockStudySessionRepository.save).toHaveBeenCalledTimes(1)
      const savedSession = mockStudySessionRepository.save.mock.calls[0][0]
      expect(savedSession.deckId).toBe(request.deckId)
      expect(savedSession.studyMode).toBe(StudyModeEnum.MULTIPLE_CHOICE)
    })

    it('Given invalid study data with no deckId, When execute is called, Then it throws StudySessionValidationError', async () => {
      const request = {
        deckId: '',
        studyMode: StudyModeEnum.FLASHCARD,
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
