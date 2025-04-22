import { describe, expect, it } from 'vitest'

import { DomainError } from '@/domain/errors/domain-error'
import { InvalidQuestionMetadataError } from '@/domain/errors/study-session/invalid-question-metadata-error'
import { InvalidStudySessionDifficultyError } from '@/domain/errors/study-session/invalid-study-session-difficulty-error'
import { InvalidStudyTypeError } from '@/domain/errors/study-session/invalid-study-type-error'
import { StudySessionValidationError } from '@/domain/errors/study-session/study-session-validation-error'
import { StudyType } from '@/domain/types'
import { DifficultyEnum } from '@/domain/value-objects'

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

  describe('InvalidStudySessionDifficultyError', () => {
    it('should extend DomainError', () => {
      const error = new InvalidStudySessionDifficultyError('invalid-difficulty')
      expect(error).toBeInstanceOf(DomainError)
    })

    it('should set the correct error message and name', () => {
      const invalidDifficulty = 'invalid-difficulty'
      const error = new InvalidStudySessionDifficultyError(invalidDifficulty)

      expect(error.message).toBe(
        `The Study Session difficulty ${invalidDifficulty} is invalid. Valid difficulties are: ${Object.values(DifficultyEnum).join(', ')}`,
      )
      expect(error.name).toBe('InvalidStudySessionDifficultyError')
    })
  })
})
