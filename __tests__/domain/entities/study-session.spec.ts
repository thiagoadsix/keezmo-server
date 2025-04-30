/* eslint-disable import/order */
import {
  mockId,
  generateIdMock,
} from '../../@support/mocks/shared/utils/generate-id.mock'
/* eslint-enable import/order */

import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import { StudySession } from '@/domain/entities/study-session'
import { InvalidStudyModeError } from '@/domain/errors/deck'
import { StudySessionValidationError } from '@/domain/errors/study-session/study-session-validation-error'
import { StudyModeEnum } from '@/domain/value-objects'

import {
  validFlashcardSessionProps,
  invalidSessionPropsWithoutDeckId,
  invalidSessionPropsWithoutStartTime,
  invalidSessionPropsWithInvalidStudyType,
} from '../../@support/fixtures/study-session.fixtures'

describe('StudySession', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    generateIdMock.mockReturnValue(mockId)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  describe('constructor', () => {

    it('should create a valid StudySession with flashcard type', () => {
      const session = new StudySession({
        ...validFlashcardSessionProps,
      })

      expect(session.studyMode).toBe(StudyModeEnum.FLASHCARD)
    })

    it('should throw when deckId is missing', () => {
      expect(() => new StudySession(invalidSessionPropsWithoutDeckId)).toThrow(
        StudySessionValidationError,
      )
    })

    it('should throw when startTime is missing', () => {
      expect(
        () => new StudySession(invalidSessionPropsWithoutStartTime),
      ).toThrow(StudySessionValidationError)
    })

    it('should throw when study mode is invalid', () => {
      expect(
        () => new StudySession(invalidSessionPropsWithInvalidStudyType),
      ).toThrow(InvalidStudyModeError)
    })
  })

  describe('update methods', () => {
    describe('setEndTime', () => {
      it('should update the end time', () => {
        const session = new StudySession(validFlashcardSessionProps)
        const fixedDate = new Date('2023-01-02T12:00:00Z')
        vi.setSystemTime(fixedDate)

        const newEndTime = '2023-05-15T11:00:00Z'

        session.setEndTime(newEndTime)

        expect(session.endTime).toBe(newEndTime)
      })

      it('should throw when end time is empty', () => {
        const session = new StudySession(validFlashcardSessionProps)

        expect(() => session.setEndTime('')).toThrow(
          StudySessionValidationError,
        )
      })
    })

    describe('setStartTime', () => {
      it('should update the start time', () => {
        const session = new StudySession(validFlashcardSessionProps)
        const fixedDate = new Date('2023-01-02T12:00:00Z')
        vi.setSystemTime(fixedDate)

        const newStartTime = '2023-05-15T11:00:00Z'

        session.setStartTime(newStartTime)

        expect(session.startTime).toBe(newStartTime)
      })

      it('should throw when start time is empty', () => {
        const session = new StudySession(validFlashcardSessionProps)

        expect(() => session.setStartTime('')).toThrow(
          StudySessionValidationError,
        )
      })
    })
  })
})
