import { RatingEnum } from '@/domain/value-objects'

import { DomainError } from '../domain-error'

export class InvalidStudySessionRatingError extends DomainError {
  constructor(rating: string) {
    super(
      `The Study Session rating ${rating} is invalid. Valid ratings are: ${Object.values(RatingEnum).join(', ')}`,
    )
    this.name = 'InvalidStudySessionRatingError'
  }
}
