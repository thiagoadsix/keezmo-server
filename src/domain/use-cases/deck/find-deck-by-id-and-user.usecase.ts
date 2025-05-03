import { Deck } from "@/domain/entities/deck";
import { DeckNotFoundError } from "@/domain/errors/deck/deck-not-found-error";
import { DeckRepository } from "@/domain/interfaces/repositories";

interface FindDeckByIdAndUserRequest {
  id: string;
  userId: string;
}

type FindDeckByIdAndUserResponse = Deck;

export class FindDeckByIdAndUserUseCase {
  constructor(private readonly deckRepository: DeckRepository) {}

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

    console.log(`Found deck: ${deck.title} with ${deck.cards.length} cards`);
    return deck;
  }
}
