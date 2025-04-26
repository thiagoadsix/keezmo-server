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
    const startTime = new Date('2023-05-15T09:50:00Z').toISOString()
    mockSession = new StudySession({
      deckId: 'deck-123',
      studyMode: StudyModeEnum.FLASHCARD,
      startTime,
      endTime: startTime,
    })

    Object.defineProperty(mockSession, 'id', { value: sessionId })

    studySessionRepository = {
      findById: vi.fn().mockResolvedValue(mockSession),
      findByUserId: vi.fn(),
      save: vi.fn(),
      deleteById: vi.fn(),
    }

    sut = new EndStudySessionUseCase(studySessionRepository)

    vi.spyOn(console, 'log').mockImplementation(() => {})

    const fixedDate = new Date('2023-05-15T10:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(fixedDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should update the session with the correct end time', async () => {
    const request = {
      sessionId,
    }

    const result = await sut.execute(request)

    expect(studySessionRepository.findById).toHaveBeenCalledWith(sessionId)
    expect(studySessionRepository.save).toHaveBeenCalledTimes(1)

    const updatedSession = vi.mocked(studySessionRepository.save).mock
      .calls[0][0]
    expect(updatedSession.endTime).toBe('2023-05-15T10:00:00.000Z')

    expect(result.durationSeconds).toBe(600)
  })

  it('should throw StudySessionNotFoundError if session does not exist', async () => {
    vi.mocked(studySessionRepository.findById).mockResolvedValueOnce(null)

    const request = {
      sessionId: 'non-existent-session',
    }

    await expect(sut.execute(request)).rejects.toThrow(
      StudySessionNotFoundError,
    )
    expect(studySessionRepository.save).not.toHaveBeenCalled()
  })

  it('should include totalQuestions in log when provided', async () => {
    const consoleSpy = vi.spyOn(console, 'log')

    const request = {
      sessionId,
      totalQuestions: 15,
    }

    await sut.execute(request)

    expect(consoleSpy).toHaveBeenCalledWith(
      'Study session ended successfully',
      expect.objectContaining({
        totalQuestions: 15,
      }),
    )
  })

  it('should handle repository errors when saving', async () => {
    const error = new Error('Repository error')
    vi.mocked(studySessionRepository.save).mockRejectedValueOnce(error)

    const request = {
      sessionId,
    }

    await expect(sut.execute(request)).rejects.toThrow('Repository error')
  })
})
