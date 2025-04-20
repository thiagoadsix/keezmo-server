/* eslint-disable import/order */
import { mockId, generateIdMock } from '../../mocks/generate-id.mock'
/* eslint-enable import/order */

import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import { StudySession, QuestionMetadata } from '@/domain/entities/study-session'
import { InvalidQuestionMetadataError } from '@/domain/errors/study-session/invalid-question-metadata-error'
import { InvalidStudyTypeError } from '@/domain/errors/study-session/invalid-study-type-error'
import { StudySessionValidationError } from '@/domain/errors/study-session/study-session-validation-error'
import { StudyType } from '@/domain/types'
import { Rating, RatingEnum } from '@/domain/value-objects'

import {
  validMultipleChoiceSessionProps,
  validFlashcardSessionProps,
  invalidSessionPropsWithoutDeckId,
  invalidSessionPropsWithoutStartTime,
  invalidSessionPropsWithoutEndTime,
  invalidSessionPropsWithInvalidStudyType,
  invalidFlashcardSessionWithHits,
  invalidMultipleChoiceSessionWithRatings,
} from '../../fixtures/study-session.fixtures'

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
    it('should create a valid StudySession with multiple choice type', () => {
      const fixedDate = new Date('2023-01-01T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      const session = new StudySession(validMultipleChoiceSessionProps)

      expect(session).toBeInstanceOf(StudySession)
      expect(session.id).toBe(mockId)
      expect(session.deckId).toBe(validMultipleChoiceSessionProps.deckId)
      expect(session.startTime).toBe(validMultipleChoiceSessionProps.startTime)
      expect(session.endTime).toBe(validMultipleChoiceSessionProps.endTime)
      expect(session.studyType).toBe('multiple_choice' as StudyType)
      expect(session.questionsMetadata).toEqual(
        validMultipleChoiceSessionProps.questionsMetadata,
      )
      expect(session.hits).toBe(validMultipleChoiceSessionProps.hits)
      expect(session.misses).toBe(validMultipleChoiceSessionProps.misses)
      expect(session.ratings).toBeUndefined()
      expect(session.createdAt).toBe(expectedDateString)
      expect(session.updatedAt).toBe(expectedDateString)
    })

    it('should create a valid StudySession with flashcard type', () => {
      const session = new StudySession({
        ...validFlashcardSessionProps,
        questionsMetadata: [],
      })

      expect(session.studyType).toBe('flashcard' as StudyType)
      expect(session.ratings).toEqual(validFlashcardSessionProps.ratings)
      expect(session.hits).toBeUndefined()
      expect(session.misses).toBeUndefined()
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

    it('should throw when endTime is missing', () => {
      expect(() => new StudySession(invalidSessionPropsWithoutEndTime)).toThrow(
        StudySessionValidationError,
      )
    })

    it('should throw when study type is invalid', () => {
      expect(
        () => new StudySession(invalidSessionPropsWithInvalidStudyType),
      ).toThrow(InvalidStudyTypeError)
    })

    it('should throw when flashcard session has hits/misses', () => {
      expect(() => new StudySession(invalidFlashcardSessionWithHits)).toThrow(
        StudySessionValidationError,
      )
    })

    it('should throw when multiple choice session has ratings', () => {
      expect(
        () => new StudySession(invalidMultipleChoiceSessionWithRatings),
      ).toThrow(StudySessionValidationError)
    })
  })

  describe('addQuestionMetadata', () => {
    it('should add question metadata to the session', () => {
      const session = new StudySession(validMultipleChoiceSessionProps)
      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      const initialLength = session.questionsMetadata?.length || 0

      const newMetadata: QuestionMetadata = {
        questionId: 'question-3',
        attempts: 1,
        consecutiveHits: 1,
        errors: 0,
      }

      session.addQuestionMetadata(newMetadata)

      expect(session.questionsMetadata?.length).toBe(initialLength + 1)
      expect(session.questionsMetadata?.[initialLength]).toEqual(newMetadata)
      expect(session.updatedAt).toBe(expectedDateString)
    })

    it('should throw when questionId is missing', () => {
      const session = new StudySession(validMultipleChoiceSessionProps)

      const invalidMetadata = {
        questionId: '',
        attempts: 1,
        consecutiveHits: 1,
        errors: 0,
      }

      expect(() => session.addQuestionMetadata(invalidMetadata)).toThrow(
        InvalidQuestionMetadataError,
      )
    })
  })

  describe('updateQuestionMetadata', () => {
    it('should update existing question metadata', () => {
      const session = new StudySession(validMultipleChoiceSessionProps)
      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      const questionId = 'question-1'
      const updates = {
        attempts: 5,
        errors: 2,
      }

      session.updateQuestionMetadata(questionId, updates)

      const updatedMetadata = session.questionsMetadata?.find((qm) => {
        return qm.questionId === questionId
      })

      expect(updatedMetadata?.attempts).toBe(updates.attempts)
      expect(updatedMetadata?.errors).toBe(updates.errors)
      expect(updatedMetadata?.consecutiveHits).toBe(2)
      expect(session.updatedAt).toBe(expectedDateString)
    })

    it('should throw when question is not found', () => {
      const session = new StudySession(validMultipleChoiceSessionProps)

      expect(() =>
        session.updateQuestionMetadata('non-existent-id', { attempts: 1 }),
      ).toThrow(InvalidQuestionMetadataError)
    })
  })

  describe('flashcard session methods', () => {
    it('should add rating to flashcard session', () => {
      const session = new StudySession(validFlashcardSessionProps)
      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      const initialLength = session.ratings!.length

      const newRating = {
        questionId: 'question-3',
        rating: new Rating(RatingEnum.NORMAL),
      }

      session.addRating(newRating)

      expect(session.ratings!.length).toBe(initialLength + 1)
      expect(session.ratings![initialLength]).toEqual(newRating)
      expect(session.updatedAt).toBe(expectedDateString)
    })

    it('should throw when adding rating to multiple choice session', () => {
      const session = new StudySession(validMultipleChoiceSessionProps)

      const rating = {
        questionId: 'question-1',
        rating: new Rating(RatingEnum.EASY),
      }

      expect(() => session.addRating(rating)).toThrow(
        StudySessionValidationError,
      )
    })
  })

  describe('multiple choice session methods', () => {
    it('should increment hits for multiple choice session', () => {
      const session = new StudySession(validMultipleChoiceSessionProps)
      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      const initialHits = session.hits!

      session.incrementHits()

      expect(session.hits).toBe(initialHits + 1)
      expect(session.updatedAt).toBe(expectedDateString)
    })

    it('should increment misses for multiple choice session', () => {
      const session = new StudySession(validMultipleChoiceSessionProps)
      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      const initialMisses = session.misses!

      session.incrementMisses()

      expect(session.misses).toBe(initialMisses + 1)
      expect(session.updatedAt).toBe(expectedDateString)
    })

    it('should throw when incrementing hits in flashcard session', () => {
      const session = new StudySession(validFlashcardSessionProps)

      expect(() => session.incrementHits()).toThrow(StudySessionValidationError)
    })

    it('should throw when incrementing misses in flashcard session', () => {
      const session = new StudySession(validFlashcardSessionProps)

      expect(() => session.incrementMisses()).toThrow(
        StudySessionValidationError,
      )
    })
  })

  describe('update methods', () => {
    it('should update the end time', () => {
      const session = new StudySession(validMultipleChoiceSessionProps)
      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      const newEndTime = '2023-05-15T11:00:00Z'

      session.setEndTime(newEndTime)

      expect(session.endTime).toBe(newEndTime)
      expect(session.updatedAt).toBe(expectedDateString)
    })

    it('should throw when end time is empty', () => {
      const session = new StudySession(validMultipleChoiceSessionProps)

      expect(() => session.setEndTime('')).toThrow(StudySessionValidationError)
    })
  })

  describe('calculation methods', () => {
    it('should calculate total attempts correctly', () => {
      const session = new StudySession(validMultipleChoiceSessionProps)

      const expectedTotalAttempts =
        validMultipleChoiceSessionProps.questionsMetadata.reduce(
          (sum, qm) => sum + qm.attempts,
          0,
        )
      expect(session.getTotalAttempts()).toBe(expectedTotalAttempts)
    })

    it('should calculate total errors correctly', () => {
      const session = new StudySession(validMultipleChoiceSessionProps)

      const expectedTotalErrors =
        validMultipleChoiceSessionProps.questionsMetadata.reduce(
          (sum, qm) => sum + qm.errors,
          0,
        )
      expect(session.getTotalErrors()).toBe(expectedTotalErrors)
    })

    it('should calculate accuracy for multiple choice session', () => {
      const session = new StudySession(validMultipleChoiceSessionProps)

      const hits = validMultipleChoiceSessionProps.hits || 0
      const misses = validMultipleChoiceSessionProps.misses || 0
      const total = hits + misses
      const expectedAccuracy = total > 0 ? (hits / total) * 100 : 0

      expect(session.getAccuracy()).toBeCloseTo(expectedAccuracy, 1)
    })

    it('should calculate accuracy for flashcard session', () => {
      const session = new StudySession(validFlashcardSessionProps)

      const totalAttempts =
        session.questionsMetadata?.reduce((sum, qm) => sum + qm.attempts, 0) ||
        0
      const totalErrors =
        session.questionsMetadata?.reduce((sum, qm) => sum + qm.errors, 0) || 0
      const expectedAccuracy =
        totalAttempts > 0
          ? ((totalAttempts - totalErrors) / totalAttempts) * 100
          : 0

      expect(session.getAccuracy()).toBe(expectedAccuracy)
    })

    it('should return 0 accuracy when no attempts made', () => {
      const session = new StudySession({
        ...validMultipleChoiceSessionProps,
        questionsMetadata: [],
        hits: 0,
        misses: 0,
      })

      expect(session.getAccuracy()).toBe(0)
    })
  })
})
