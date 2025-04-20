import { InvalidStudySessionRatingError } from '../errors/study-session'

export enum RatingEnum {
  AGAIN = 'again',
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard',
}

export class Rating {
  private readonly value: RatingEnum

  constructor(rating: string) {
    if (!this.isValidRating(rating)) {
      throw new InvalidStudySessionRatingError(rating)
    }
    this.value = rating as RatingEnum
  }

  private isValidRating(rating: string) {
    return Object.values(RatingEnum).includes(rating as RatingEnum)
  }

  public getValue(): RatingEnum {
    return this.value
  }
}
