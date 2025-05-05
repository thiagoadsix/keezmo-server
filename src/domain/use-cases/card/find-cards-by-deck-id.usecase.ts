import {
  CardRepository,
  DeckRepository,
} from "@/domain/interfaces/repositories";
import { Card } from "@/domain/entities/card";
import { DeckNotFoundError } from "@/domain/errors/deck/deck-not-found-error";

interface FindCardsByDeckIdRequest {
  deckId: string;
  userId: string;
}

type FindCardsByDeckIdResponse = Card[];

export class FindCardsByDeckIdUseCase {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly deckRepository: DeckRepository
  ) {}

  async execute(
    request: FindCardsByDeckIdRequest
  ): Promise<FindCardsByDeckIdResponse> {
    console.log(
      `Starting FindCardsByDeckIdUseCase for deckId: ${request.deckId} and userId: ${request.userId}`
    );

    const deck = await this.deckRepository.findByIdAndUserId(
      request.deckId,
      request.userId
    );

    if (!deck) {
      console.log(`Deck with ID ${request.deckId} not found`);
      throw new DeckNotFoundError(request.deckId, "unknown");
    }

    const cards = await this.cardRepository.findByDeckId(request.deckId);
    console.log(`Found ${cards.length} cards for deck ${request.deckId}`);

    return cards;
  }
}
