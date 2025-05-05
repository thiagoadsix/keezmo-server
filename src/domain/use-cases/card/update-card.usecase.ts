import {
  CardRepository,
  DeckRepository,
} from "@/domain/interfaces/repositories";
import { Card } from "@/domain/entities/card";
import { CardNotFoundError } from "@/domain/errors/card/card-not-found-error";
import { DeckNotFoundError } from "@/domain/errors/deck/deck-not-found-error";

interface CardData {
  question: string;
  answer: string;
}

interface UpdateCardRequest {
  id: string;
  deckId: string;
  userId: string;
  data: Partial<CardData>;
}

export class UpdateCardUseCase {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly deckRepository: DeckRepository
  ) {}

  async execute(request: UpdateCardRequest): Promise<Card> {
    console.log(
      `Starting UpdateCardUseCase for id: ${request.id}, deckId: ${request.deckId}`
    );

    const deck = await this.deckRepository.findByIdAndUserId(
      request.deckId,
      request.userId
    );

    if (!deck) {
      console.log(`Deck with ID ${request.deckId} not found`);
      throw new DeckNotFoundError(request.deckId, "unknown");
    }

    const card = await this.cardRepository.findByIdAndDeckId(
      request.id,
      request.deckId
    );

    if (!card) {
      console.log(
        `Card with ID ${request.id} not found in deck ${request.deckId}`
      );
      throw new CardNotFoundError(request.id, request.deckId);
    }

    if (card.deckId !== request.deckId) {
      console.log(
        `Card with ID ${request.id} belongs to deck ${card.deckId}, not ${request.deckId}`
      );
      throw new CardNotFoundError(request.id, request.deckId);
    }

    this.updateCardFields(card, request.data);

    await this.cardRepository.save(card);

    console.log(
      `Successfully updated card ${request.id} in deck ${request.deckId}`
    );
    return card;
  }

  private updateCardFields(
    card: Card,
    updateData: UpdateCardRequest["data"]
  ): void {
    if (
      updateData.question !== undefined &&
      updateData.question !== card.question
    ) {
      card.updateQuestion(updateData.question);
    }

    if (updateData.answer !== undefined && updateData.answer !== card.answer) {
      card.updateAnswer(updateData.answer);
    }
  }
}
