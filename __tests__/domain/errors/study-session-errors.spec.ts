import { describe, expect, it } from 'vitest'

import { DomainError } from '@/domain/errors/domain-error'
import { InvalidQuestionMetadataError } from '@/domain/errors/study-session/invalid-question-metadata-error'
import { InvalidStudySessionRatingError } from '@/domain/errors/study-session/invalid-study-session-rating-error'
import { InvalidStudyTypeError } from '@/domain/errors/study-session/invalid-study-type-error'
import { StudySessionValidationError } from '@/domain/errors/study-session/study-session-validation-error'
import { StudyType } from '@/domain/types'
import { RatingEnum } from '@/domain/value-objects'

describe('StudySession Domain Errors', () => {
  describe('InvalidStudyTypeError', () => {
    it('should extend DomainError', () => {
      const error = new InvalidStudyTypeError('invalid-type')
      expect(error).toBeInstanceOf(DomainError)
    })

    it('should set the correct error message and name', () => {
      const invalidType = 'invalid-type'
      const error = new InvalidStudyTypeError(invalidType)

      expect(error.message).toBe(
        `The Study Session type ${invalidType} is invalid. Valid types are: ${'multiple_choice' as StudyType} and ${'flashcard' as StudyType}`,
      )
      expect(error.name).toBe('InvalidStudyTypeError')
    })
  })

  describe('InvalidQuestionMetadataError', () => {
    it('should extend DomainError', () => {
      const error = new InvalidQuestionMetadataError(
        'Invalid question metadata',
      )
      expect(error).toBeInstanceOf(DomainError)
    })

    it('should set the correct error message and name', () => {
      const message = 'Question ID is required'
      const error = new InvalidQuestionMetadataError(message)

      expect(error.message).toBe(message)
      expect(error.name).toBe('InvalidQuestionMetadataError')
    })
  })

  describe('StudySessionValidationError', () => {
    it('should extend DomainError', () => {
      const error = new StudySessionValidationError('Validation failed')
      expect(error).toBeInstanceOf(DomainError)
    })

    it('should set the correct error message and name', () => {
      const message = 'Start time is required'
      const error = new StudySessionValidationError(message)

      expect(error.message).toBe(message)
      expect(error.name).toBe('StudySessionValidationError')
    })
  })

  describe('InvalidStudySessionRatingError', () => {
    it('should extend DomainError', () => {
      const error = new InvalidStudySessionRatingError('invalid-rating')
      expect(error).toBeInstanceOf(DomainError)
    })

    it('should set the correct error message and name', () => {
      const invalidRating = 'invalid-rating'
      const error = new InvalidStudySessionRatingError(invalidRating)

      expect(error.message).toBe(
        `The Study Session rating ${invalidRating} is invalid. Valid ratings are: ${Object.values(RatingEnum).join(', ')}`,
      )
      expect(error.name).toBe('InvalidStudySessionRatingError')
    })
  })
})
