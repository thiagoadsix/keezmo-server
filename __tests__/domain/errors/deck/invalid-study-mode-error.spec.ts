import { describe, expect, it } from 'vitest'

import { InvalidStudyModeError } from '@/domain/errors/deck/invalid-study-mode-error'
import { StudyModeEnum } from '@/domain/value-objects'
describe('InvalidStudyModeError', () => {
  it('should set the correct error message and name', () => {
    const invalidStudyMode = 'invalid-study-mode'

    const error = new InvalidStudyModeError(invalidStudyMode)

    expect(error.message).toBe(
      `The study mode "${invalidStudyMode}" is invalid. Valid modes are: ${StudyModeEnum.MULTIPLE_CHOICE}, ${StudyModeEnum.FLASHCARD}.`,
    )
    expect(error.name).toBe('InvalidStudyModeError')
  })
})
