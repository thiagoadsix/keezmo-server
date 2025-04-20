import { Deck } from '@/domain/entities/deck'
import { DeckNotFoundError } from '@/domain/errors/deck/deck-not-found-error'
import { DeckUpdateError } from '@/domain/errors/deck/deck-update-error'
import { DeckRepository } from '@/domain/interfaces/deck-repository'
import { DeckType } from '@/domain/value-objects'

interface DeckUpdateData {
  title: string
  description: string
  type: string
}

interface UpdateDeckRequest {
  deckId: string
  userId: string
  data: Partial<DeckUpdateData>
}

type UpdateDeckResponse = Deck

export class UpdateDeckUseCase {
  constructor(private readonly deckRepository: DeckRepository) {}

  async execute(request: UpdateDeckRequest): Promise<UpdateDeckResponse> {
    console.log(
      `Starting UpdateDeckUseCase for deckId: ${request.deckId}, userId: ${request.userId}`,
    )

    try {
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

      console.log(`Found deck: ${deck.title}, applying updates`)

      this.applyUpdates(deck, request.data)

      await this.deckRepository.save(deck)

      console.log(`Successfully updated deck ${request.deckId}`)
      return deck
    } catch (error) {
      if (error instanceof DeckNotFoundError) {
        throw error
      }

      console.error(
        `Error updating deck ${request.deckId}: ${(error as Error).message}`,
      )
      throw new DeckUpdateError(request.deckId, request.userId, error as Error)
    }
  }

  private applyUpdates(
    deck: Deck,
    updateData: UpdateDeckRequest['data'],
  ): void {
    if (updateData.title && updateData.title !== deck.title) {
      deck.updateTitle(updateData.title)
    }

    if (updateData.description && updateData.description !== deck.description) {
      deck.updateDescription(updateData.description)
    }

    if (updateData.type && updateData.type !== deck.type.getValue()) {
      deck.updateType(new DeckType(updateData.type))
    }
  }
}
