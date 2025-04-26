import { describe, expect, it } from 'vitest'

import { DomainError } from '@/domain/errors/domain-error'
import { InvalidStudySessionDifficultyError } from '@/domain/errors/study-session/invalid-study-session-difficulty-error'
import { DifficultyEnum } from '@/domain/value-objects'

describe('InvalidStudySessionDifficultyError', () => {
  it('should set the correct error message and name', () => {
    const invalidDifficulty = 'unknown'
    const validDifficulties = Object.values(DifficultyEnum).join(', ')

    const error = new InvalidStudySessionDifficultyError(invalidDifficulty)

    expect(error.message).toBe(
      `The Study Session difficulty ${invalidDifficulty} is invalid. Valid difficulties are: ${validDifficulties}`,
    )
    expect(error.name).toBe('InvalidStudySessionDifficultyError')
  })

  it('should extend DomainError', () => {
    const error = new InvalidStudySessionDifficultyError('invalid')

    expect(error).toBeInstanceOf(DomainError)
  })
})
