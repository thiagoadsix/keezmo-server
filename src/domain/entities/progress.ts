import { MissingProgressIdsError } from '@/domain/errors/progress/missing-ids-error'

import { DEFAULT_EASE_FACTOR } from '@/shared/constants/srs'
import { generateId } from '@/shared/utils/generate-id'

export interface ProgressProps {
  id?: string
  cardId: string
  deckId: string
  repetitions?: number
  interval?: number
  easeFactor?: number
  nextReview?: string
  lastReviewed?: string
  createdAt?: string
  updatedAt?: string
}

export class Progress {
  public readonly id: string
  public readonly cardId: string
  public readonly deckId: string
  public repetitions: number
  public interval: number
  public easeFactor: number
  public nextReview: string
  public lastReviewed: string
  public readonly createdAt: string
  public updatedAt: string

  constructor(props: ProgressProps) {
    if (!props.cardId || !props.deckId) {
      throw new MissingProgressIdsError()
    }

    this.id = props.id ?? generateId()
    this.cardId = props.cardId
    this.deckId = props.deckId
    this.repetitions = props.repetitions ?? 0
    this.interval = props.interval ?? 0
    this.easeFactor = props.easeFactor ?? DEFAULT_EASE_FACTOR
    this.nextReview = props.nextReview ?? new Date().toISOString()
    this.lastReviewed = props.lastReviewed ?? this.nextReview
    this.createdAt = props.createdAt ?? this.nextReview
    this.updatedAt = props.updatedAt ?? this.createdAt
  }

  /**
   * The function `applyScheduling` updates scheduling parameters and timestamps for a review item.
   * @param {number} repetitions - Repetitions refer to the number of times a user has successfully
   * recalled the information during review sessions.
   * @param {number} interval - The `interval` parameter represents the time interval in days before
   * the next review. It is used to calculate the next review date based on the current date and time.
   * @param {number} easeFactor - The `easeFactor` parameter in the `applyScheduling` function
   * represents a value that is used in spaced repetition algorithms to adjust the spacing of review
   * intervals based on the user's performance in recalling the information. It typically ranges from
   * 1.3 to 2.5 and is used to calculate
   * @param {Date} nextReview - The `nextReview` parameter in the `applyScheduling` function represents
   * the date when the item is scheduled for the next review. It is a `Date` object that specifies the
   * next review date for the item being scheduled.
   */
  public applyScheduling(
    repetitions: number,
    interval: number,
    easeFactor: number,
    nextReview: Date,
  ) {
    this.repetitions = repetitions
    this.interval = interval
    this.easeFactor = easeFactor
    this.lastReviewed = new Date().toISOString()
    this.nextReview = nextReview.toISOString()
    this.updatedAt = this.lastReviewed
  }
}
