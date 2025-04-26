import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import { StudySession } from '@/domain/entities/study-session'
import { StudySessionValidationError } from '@/domain/errors/study-session/study-session-validation-error'
import { StudySessionRepository } from '@/domain/interfaces/study-session-repository'
import { StartStudySessionUseCase } from '@/domain/use-cases/study-session/start-study-session.usecase'
import { StudyModeEnum } from '@/domain/value-objects'

describe('StartStudySessionUseCase', () => {
  let studySessionRepository: StudySessionRepository
  let sut: StartStudySessionUseCase

  beforeEach(() => {
    // Create repository mock
    studySessionRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      save: vi.fn(),
      deleteById: vi.fn(),
    }

    // Create System Under Test
    sut = new StartStudySessionUseCase(studySessionRepository)

    // Mock console.log to avoid cluttering test output
    vi.spyOn(console, 'log').mockImplementation(() => {})

    // Mock Date.now for consistent timestamps
    const fixedDate = new Date('2023-05-15T10:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(fixedDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should create a flashcard study session with correct start time', async () => {
    // Arrange
    const request = {
      deckId: 'deck-123',
      studyMode: StudyModeEnum.FLASHCARD,
    }

    // Act
    const result = await sut.execute(request)

    // Assert
    expect(studySessionRepository.save).toHaveBeenCalledTimes(1)

    const savedSession = vi.mocked(studySessionRepository.save).mock.calls[0][0]
    expect(savedSession).toBeInstanceOf(StudySession)
    expect(savedSession.deckId).toBe(request.deckId)
    expect(savedSession.studyMode).toBe(StudyModeEnum.FLASHCARD)
    expect(savedSession.startTime).toBe('2023-05-15T10:00:00.000Z')

    expect(result.sessionId).toBe(savedSession.id)
  })

  it('should create a multiple choice study session', async () => {
    // Arrange
    const request = {
      deckId: 'deck-123',
      studyMode: StudyModeEnum.MULTIPLE_CHOICE,
    }

    // Act
    const result = await sut.execute(request)

    // Assert
    expect(studySessionRepository.save).toHaveBeenCalledTimes(1)

    const savedSession = vi.mocked(studySessionRepository.save).mock.calls[0][0]
    expect(savedSession).toBeInstanceOf(StudySession)
    expect(savedSession.deckId).toBe(request.deckId)
    expect(savedSession.studyMode).toBe(request.studyMode)

    expect(result.sessionId).toBe(savedSession.id)
  })

  it('should throw an error if repository fails', async () => {
    // Arrange
    const request = {
      deckId: 'deck-123',
      studyMode: StudyModeEnum.FLASHCARD,
    }

    const error = new Error('Repository error')
    vi.mocked(studySessionRepository.save).mockRejectedValueOnce(error)

    // Act & Assert
    await expect(sut.execute(request)).rejects.toThrow('Repository error')
  })

  it('should throw StudySessionValidationError if deckId is empty', async () => {
    // Arrange
    const request = {
      deckId: '',
      studyMode: StudyModeEnum.FLASHCARD,
    }

    // Act & Assert
    await expect(sut.execute(request)).rejects.toThrow(
      StudySessionValidationError,
    )
    expect(studySessionRepository.save).not.toHaveBeenCalled()
  })
})
