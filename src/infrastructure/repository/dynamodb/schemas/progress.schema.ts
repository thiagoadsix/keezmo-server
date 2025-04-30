import { AttributeValue } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

import { Progress } from "@/domain/entities/progress"

interface ProgressDynamoItem {
  id: string
  cardId: string
  deckId: string
  repetitions: number
  interval: number
  easeFactor: number
  nextReview: string
  lastReviewed: string
  createdAt: string
  updatedAt: string
}

export class ProgressDynamoSchema implements ProgressDynamoItem {
  id: string
  cardId: string
  deckId: string
  repetitions: number
  interval: number
  easeFactor: number
  nextReview: string
  lastReviewed: string
  createdAt: string
  updatedAt: string

  constructor(progress: Progress) {
    this.id = progress.id
    this.cardId = progress.cardId
    this.deckId = progress.deckId
    this.repetitions = progress.repetitions
    this.interval = progress.interval
    this.easeFactor = progress.easeFactor
    this.nextReview = progress.nextReview
    this.lastReviewed = progress.lastReviewed
    this.createdAt = progress.createdAt
    this.updatedAt = progress.updatedAt
  }

  static buildPK(deckId: string,) {
    return `DECK#$#${deckId}`
  }

  static buildSK(cardId: string) {
    return `CARD#${cardId}`
  }

  static buildGSI1PK(cardId: string) {
    return `CARD#${cardId}`
  }

  static buildGSI1SK(cardId: string) {
    return `CARD#${cardId}`
  }

  toMarshall() {
    return marshall(this, {
      convertClassInstanceToMap: true,
      convertEmptyValues: true,
      removeUndefinedValues: true,
    })
  }

  static fromDynamoItem(item: Record<string, AttributeValue>): Progress {
    const progress = unmarshall(item)

    return new Progress({
      id: progress.id,
      cardId: progress.cardId,
      deckId: progress.deckId,
      repetitions: progress.repetitions,
      interval: progress.interval,
      easeFactor: progress.easeFactor,
      nextReview: progress.nextReview,
      lastReviewed: progress.lastReviewed,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    })
  }
}
