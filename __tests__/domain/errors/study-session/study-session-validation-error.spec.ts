import { describe, expect, it } from 'vitest'

import { DomainError } from '@/domain/errors/domain-error'
import { StudySessionValidationError } from '@/domain/errors/study-session/study-session-validation-error'

describe('StudySessionValidationError', () => {
  it('should set the correct error message and name', () => {
    const message = 'The study session is invalid'

    const error = new StudySessionValidationError(message)

    expect(error.message).toBe(message)
    expect(error.name).toBe('StudySessionValidationError')
    expect(error).toBeInstanceOf(DomainError)
  })
})
