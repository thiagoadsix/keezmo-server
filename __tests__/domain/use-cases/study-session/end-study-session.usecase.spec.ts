import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import { StudySession } from '@/domain/entities/study-session'
import { StudySessionNotFoundError } from '@/domain/errors/study-session/study-session-not-found-error'
import { StudySessionRepository } from '@/domain/interfaces/study-session-repository'
import { EndStudySessionUseCase } from '@/domain/use-cases/study-session/end-study-session.usecase'
import { StudyModeEnum } from '@/domain/value-objects'

describe('EndStudySessionUseCase', () => {
  let studySessionRepository: StudySessionRepository
  let sut: EndStudySessionUseCase
  let mockSession: StudySession

  const sessionId = 'session-123'

  beforeEach(() => {
    // Create a mock session with a start time 10 minutes ago
    const startTime = new Date('2023-05-15T09:50:00Z').toISOString()
    mockSession = new StudySession({
      deckId: 'deck-123',
      studyMode: StudyModeEnum.FLASHCARD,
      startTime,
      endTime: startTime, // Initially the same as start time
    })

    // Set mock session id
    Object.defineProperty(mockSession, 'id', { value: sessionId })

    // Create repository mock
    studySessionRepository = {
      findById: vi.fn().mockResolvedValue(mockSession),
      findByUserId: vi.fn(),
      save: vi.fn(),
      deleteById: vi.fn(),
    }

    // Create System Under Test
    sut = new EndStudySessionUseCase(studySessionRepository)

    // Mock console.log to avoid cluttering test output
    vi.spyOn(console, 'log').mockImplementation(() => {})

    // Mock current time to 10 minutes after session started
    const fixedDate = new Date('2023-05-15T10:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(fixedDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should update the session with the correct end time', async () => {
    // Arrange
    const request = {
      sessionId,
    }

    // Act
    const result = await sut.execute(request)

    // Assert
    expect(studySessionRepository.findById).toHaveBeenCalledWith(sessionId)
    expect(studySessionRepository.save).toHaveBeenCalledTimes(1)

    const updatedSession = vi.mocked(studySessionRepository.save).mock
      .calls[0][0]
    expect(updatedSession.endTime).toBe('2023-05-15T10:00:00.000Z')

    // Session duration should be 10 minutes = 600 seconds
    expect(result.durationSeconds).toBe(600)
  })

  it('should throw StudySessionNotFoundError if session does not exist', async () => {
    // Arrange
    vi.mocked(studySessionRepository.findById).mockResolvedValueOnce(null)

    const request = {
      sessionId: 'non-existent-session',
    }

    // Act & Assert
    await expect(sut.execute(request)).rejects.toThrow(
      StudySessionNotFoundError,
    )
    expect(studySessionRepository.save).not.toHaveBeenCalled()
  })

  it('should include totalQuestions in log when provided', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'log')

    const request = {
      sessionId,
      totalQuestions: 15,
    }

    // Act
    await sut.execute(request)

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      'Study session ended successfully',
      expect.objectContaining({
        totalQuestions: 15,
      }),
    )
  })

  it('should handle repository errors when saving', async () => {
    // Arrange
    const error = new Error('Repository error')
    vi.mocked(studySessionRepository.save).mockRejectedValueOnce(error)

    const request = {
      sessionId,
    }

    // Act & Assert
    await expect(sut.execute(request)).rejects.toThrow('Repository error')
  })
})
