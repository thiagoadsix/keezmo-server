import { DifficultyEnum } from '@/domain/value-objects'

import { DomainError } from '../domain-error'

export class InvalidStudySessionDifficultyError extends DomainError {
  constructor(difficulty: string) {
    super(
      `The Study Session difficulty ${difficulty} is invalid. Valid difficulties are: ${Object.values(DifficultyEnum).join(', ')}`,
    )
    this.name = InvalidStudySessionDifficultyError.name
  }
}
