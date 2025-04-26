import { Progress } from '@/domain/entities/progress'
import { ProgressRepository } from '@/domain/interfaces/progress-repository'

type InitializeProgressRequest = {
  cardId: string
  deckId: string
}

type InitializeProgressResponse = {
  progress: Progress
  isNew: boolean
}

export class InitializeProgressUseCase {
  constructor(private readonly progressRepository: ProgressRepository) {}

  public async execute({
    cardId,
    deckId,
  }: InitializeProgressRequest): Promise<InitializeProgressResponse> {
    console.log(`Starting for card=${cardId} in deck=${deckId}`)

    const existingProgress = await this.progressRepository.findByCardAndDeck(
      cardId,
      deckId,
    )

    if (existingProgress) {
      console.log(`Progress already exists with id=${existingProgress.id}`)
      return {
        progress: existingProgress,
        isNew: false,
      }
    }

    const newProgress = new Progress({
      cardId,
      deckId,
    })

    await this.progressRepository.save(newProgress)

    console.log(`Created new progress with id=${newProgress.id}`)

    return {
      progress: newProgress,
      isNew: true,
    }
  }
}
