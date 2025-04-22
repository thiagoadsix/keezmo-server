import { describe, expect, it } from 'vitest'

import { InvalidStudyModeError } from '@/domain/errors/deck'
import { DomainError } from '@/domain/errors/domain-error'
import { InvalidQuestionMetadataError } from '@/domain/errors/study-session/invalid-question-metadata-error'
import { InvalidStudySessionDifficultyError } from '@/domain/errors/study-session/invalid-study-session-difficulty-error'
import { StudySessionValidationError } from '@/domain/errors/study-session/study-session-validation-error'
import { DifficultyEnum, StudyModeEnum } from '@/domain/value-objects'

describe('StudySession Domain Errors', () => {
  describe('InvalidStudyModeError', () => {
    it('should extend DomainError', () => {
      const error = new InvalidStudyModeError('invalid-mode')
      expect(error).toBeInstanceOf(DomainError)
    })

    it('should set the correct error message and name', () => {
      const invalidStudyMode = 'invalid-study-mode'
      const error = new InvalidStudyModeError(invalidStudyMode)

      expect(error.message).toBe(
        `The study mode "${invalidStudyMode}" is invalid. Valid modes are: ${StudyModeEnum.MULTIPLE_CHOICE}, ${StudyModeEnum.FLASHCARD}.`,
      )
      expect(error.name).toBe('InvalidStudyModeError')
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
