import { StudyType } from '@/domain/types'

import { DomainError } from '../domain-error'

export class InvalidStudyTypeError extends DomainError {
  constructor(studyType: string) {
    super(
      `The Study Session type ${studyType} is invalid. Valid types are: ${'multiple_choice' as StudyType} and ${'flashcard' as StudyType}`,
    )
    this.name = 'InvalidStudyTypeError'
  }
}
