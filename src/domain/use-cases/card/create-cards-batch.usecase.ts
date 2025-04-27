import { Card } from '@/domain/entities/card'
import { Progress } from '@/domain/entities/progress'
import { DeckNotFoundError } from '@/domain/errors/deck/deck-not-found-error'
import {
  CardRepository,
  DeckRepository,
  ProgressRepository,
} from '@/domain/interfaces/repositories'

interface CardData {
  question: string
  answer: string
}

interface CreateCardsBatchRequest {
  deckId: string
  userId: string
  cards: CardData[]
}

type CreateCardsBatchResponse = void

export class CreateCardsBatchUseCase {
  constructor(
    private cardRepository: CardRepository,
    private deckRepository: DeckRepository,
    private progressRepository: ProgressRepository,
  ) {}

  async execute(
    request: CreateCardsBatchRequest,
  ): Promise<CreateCardsBatchResponse> {
    const { deckId, userId, cards } = request

    console.log(
      `Starting CreateCardsBatchUseCase for deckId: ${deckId} with ${cards.length} cards`,
    )

    const deck = await this.deckRepository.findByIdAndUserId(deckId, userId)
    if (!deck) {
      throw new DeckNotFoundError(deckId, userId)
    }

    if (cards.length === 0) {
      console.log(`No cards to create in deck ${deckId}`)
      return
    }

    const cardsToCreate = cards.map(
      (cardData) =>
        new Card({
          deckId,
          question: cardData.question,
          answer: cardData.answer,
        }),
    )

    const progressesToCreate = cardsToCreate.map(
      (card) =>
        new Progress({
          cardId: card.id,
          deckId,
          repetitions: 0,
        }),
    )

    await Promise.all([
      this.cardRepository.saveBatch(cardsToCreate),
      this.progressRepository.saveBatch(progressesToCreate),
    ])

    console.log(`Successfully created ${cards.length} cards in deck ${deckId}`)
  }
}
