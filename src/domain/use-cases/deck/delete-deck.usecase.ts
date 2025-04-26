import { DeckNotFoundError } from '@/domain/errors/deck/deck-not-found-error'
import { CardRepository } from '@/domain/interfaces/card-repository'
import { DeckRepository } from '@/domain/interfaces/deck-repository'
import { ProgressRepository } from '@/domain/interfaces/progress-repository'

interface DeleteDeckRequest {
  deckId: string
  userId: string
}

type DeleteDeckResponse = void

export class DeleteDeckUseCase {
  constructor(
    private readonly deckRepository: DeckRepository,
    private readonly cardRepository: CardRepository,
    private readonly progressRepository: ProgressRepository,
  ) {}

  async execute(request: DeleteDeckRequest): Promise<DeleteDeckResponse> {
    console.log(
      `Starting DeleteDeckUseCase for deckId: ${request.deckId}, userId: ${request.userId}`,
    )

    const deck = await this.deckRepository.findByIdAndUserId(
      request.deckId,
      request.userId,
    )

    if (!deck) {
      console.log(
        `Deck with ID ${request.deckId} not found for user ${request.userId}`,
      )
      throw new DeckNotFoundError(request.deckId, request.userId)
    }

    if (deck.cards.length > 0) {
      const cardIds = deck.cards.map((card) => card.id)
      console.log(
        `Deleting ${cardIds.length} cards from deck ${request.deckId}`,
      )
      await this.cardRepository.deleteByIds(cardIds)

      console.log(`Deleting progress for cards ${cardIds}`)
      await this.progressRepository.deleteByDeckId(request.deckId)
    }

    console.log(`Deleting deck ${request.deckId}`)
    await this.deckRepository.delete(request.deckId)

    console.log(`Successfully deleted deck ${request.deckId} and its cards`)
  }
}
