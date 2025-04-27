import { Progress } from '@/domain/entities/progress'
import { CardNotFoundError } from '@/domain/errors/card/card-not-found-error'
import { ProgressNotFoundError } from '@/domain/errors/progress/progress-not-found-error'
import {
  CardRepository,
  ProgressRepository,
} from '@/domain/interfaces/repositories'
import { SM2SchedulerService } from '@/domain/services/sm2-scheduler.service'
import { DifficultyEnum } from '@/domain/value-objects'

type ReviewCardRequest = {
  cardId: string
  deckId: string
  difficulty: DifficultyEnum
}

type ReviewCardResponse = {
  progress: Progress
  nextReview: Date
}

export class ReviewCardUseCase {
  constructor(
    private readonly progressRepository: ProgressRepository,
    private readonly cardRepository: CardRepository,
  ) {}

  public async execute({
    cardId,
    deckId,
    difficulty,
  }: ReviewCardRequest): Promise<ReviewCardResponse> {
    console.log(
      `Reviewing card id=${cardId} in deck=${deckId} with difficulty=${difficulty}`,
    )

    const card = await this.cardRepository.findById(cardId)
    if (!card) {
      console.log(`Card not found: id=${cardId}`)
      throw new CardNotFoundError(cardId, deckId)
    }

    const progress = await this.progressRepository.findByCardAndDeck(
      cardId,
      deckId,
    )
    if (!progress) {
      console.log(`Progress not found for card=${cardId} in deck=${deckId}`)
      throw new ProgressNotFoundError(cardId, deckId)
    }

    const { updated } = SM2SchedulerService.execute({ progress, difficulty })

    await this.progressRepository.update(updated)

    console.log(
      `Card review processed: card=${cardId}, next review in ${updated.interval} days`,
    )

    const nextReview = new Date(updated.nextReview)

    return {
      progress: updated,
      nextReview,
    }
  }
}
