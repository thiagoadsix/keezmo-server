import { CardRepository, DeckRepository } from "@/domain/interfaces/repositories";
import { Deck } from "@/domain/entities/deck";
import { DeckNotFoundError } from "@/domain/errors/deck/deck-not-found-error";

interface FindDeckByIdAndUserRequest {
  id: string;
  userId: string;
}

type FindDeckByIdAndUserResponse = Deck;

export class FindDeckByIdAndUserUseCase {
  constructor(
    private readonly deckRepository: DeckRepository,
    private readonly cardRepository: CardRepository
  ) {}

  async execute(
    request: FindDeckByIdAndUserRequest
  ): Promise<FindDeckByIdAndUserResponse> {
    console.log(
      `Starting FindDeckByIdAndUserUseCase for deckId: ${request.id}, userId: ${request.userId}`
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

    const cards = await this.cardRepository.findByDeckId(request.id);

    deck.addCards(cards);

    console.log(`Found deck: ${deck.title} with ${deck.cards.length} cards`);
    return deck;
  }
}
