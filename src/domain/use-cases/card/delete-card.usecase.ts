import { CardNotFoundError } from '@/domain/errors/card/card-not-found-error'
import { DeckNotFoundError } from '@/domain/errors/deck/deck-not-found-error'
import {
  CardRepository,
  DeckRepository,
  ProgressRepository,
} from '@/domain/interfaces/repositories'

interface DeleteCardRequest {
  cardId: string
  deckId: string
  userId: string
}

type DeleteCardResponse = void

export class DeleteCardUseCase {
  constructor(
    private cardRepository: CardRepository,
    private deckRepository: DeckRepository,
    private progressRepository: ProgressRepository,
  ) {}

  async execute(request: DeleteCardRequest): Promise<DeleteCardResponse> {
    const { cardId, deckId, userId } = request

    console.log(
      `Starting DeleteCardUseCase for cardId: ${cardId}, deckId: ${deckId}`,
    )

    const deck = await this.deckRepository.findByIdAndUserId(deckId, userId)
    if (!deck) {
      throw new DeckNotFoundError(deckId, userId)
    }

    const card = await this.cardRepository.findById(cardId)
    if (!card) {
      throw new CardNotFoundError(cardId, deckId)
    }

    if (card.deckId !== deckId) {
      throw new CardNotFoundError(cardId, deckId)
    }

    await Promise.allSettled([
      this.progressRepository.deleteById(cardId),
      this.cardRepository.deleteById(cardId),
    ])

    console.log(
      `Successfully deleted card ${cardId} and progress from deck ${deckId}`,
    )
  }
}
