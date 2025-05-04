import {
  CardRepository,
  DeckRepository,
  ProgressRepository,
} from "@/domain/interfaces/repositories";
import { DeckNotFoundError } from "@/domain/errors/deck/deck-not-found-error";

interface DeleteDeckRequest {
  id: string;
  userId: string;
}

type DeleteDeckResponse = void;

export class DeleteDeckUseCase {
  constructor(
    private readonly deckRepository: DeckRepository,
    private readonly cardRepository: CardRepository,
    private readonly progressRepository: ProgressRepository
  ) {}

  async execute(request: DeleteDeckRequest): Promise<DeleteDeckResponse> {
    console.log(
      `Starting DeleteDeckUseCase for id: ${request.id}, userId: ${request.userId}`
    );

    const deck = await this.deckRepository.findByIdAndUserId(
      request.id,
      request.userId
    );

    if (!deck) {
      console.log(
        `Deck with ID ${request.id} not found for user ${request.userId}`
      );
      throw new DeckNotFoundError(request.id, request.userId);
    }

    if (deck.cards.length > 0) {
      const cardIds = deck.cards.map((card) => card.id);
      console.log(`Deleting ${cardIds.length} cards from deck ${request.id}`);
      await this.cardRepository.deleteByIds(cardIds);

      console.log(`Deleting progress for cards ${cardIds}`);
      await this.progressRepository.deleteByDeckId(request.id);
    }

    console.log(`Deleting deck ${request.id}`);
    await this.deckRepository.deleteByUser(request.id, request.userId);

    console.log(`Successfully deleted deck ${request.id} and its cards`);
  }
}
