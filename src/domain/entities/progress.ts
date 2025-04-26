import { MissingProgressIdsError } from '@/domain/errors/progress/missing-ids-error'

import { generateId } from '@/shared/utils/generate-id'

export interface ProgressProps {
  cardId: string
  deckId: string
  repetitions?: number // quantidade de revisões bem-sucedidas
  interval?: number // dias até a próxima revisão
  easeFactor?: number // EF (>= 1.3)
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

    this.id = generateId()
    this.cardId = props.cardId
    this.deckId = props.deckId
    this.repetitions = props.repetitions ?? 0
    this.interval = props.interval ?? 0
    this.easeFactor = props.easeFactor ?? 2.5 // valor inicial clássico :contentReference[oaicite:5]{index=5}
    this.nextReview = props.nextReview ?? new Date().toISOString()
    this.lastReviewed = props.lastReviewed ?? this.nextReview
    this.createdAt = props.createdAt ?? this.nextReview
    this.updatedAt = props.updatedAt ?? this.createdAt
  }

  /** Atualiza campos e carimba updatedAt */
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
