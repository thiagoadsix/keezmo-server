import { CardRepository, DeckRepository } from '@/domain/interfaces/repositories';
import { Card } from '@/domain/entities/card';
import { CardNotFoundError } from '@/domain/errors/card/card-not-found-error';
import { DeckNotFoundError } from '@/domain/errors/deck/deck-not-found-error';

interface CardData {
  question: string;
  answer: string;
}

interface UpdateCardRequest {
  deckId: string;
  cardId: string;
  data: Partial<CardData>;
}

export class UpdateCardUseCase {
  constructor(private readonly cardRepository: CardRepository, private readonly deckRepository: DeckRepository) {}

  async execute(request: UpdateCardRequest): Promise<Card> {
    console.log(`Starting UpdateCardUseCase for deckId: ${request.deckId}, cardId: ${request.cardId}`);

    const deck = await this.deckRepository.findById(request.deckId);

    if (!deck) {
      console.log(`Deck with ID ${request.deckId} not found`);
      throw new DeckNotFoundError(request.deckId, 'unknown');
    }

    const card = await this.cardRepository.findById(request.cardId);

    if (!card) {
      console.log(`Card with ID ${request.cardId} not found in deck ${request.deckId}`);
      throw new CardNotFoundError(request.cardId, request.deckId);
    }

    if (card.deckId !== request.deckId) {
      console.log(`Card with ID ${request.cardId} belongs to deck ${card.deckId}, not ${request.deckId}`);
      throw new CardNotFoundError(request.cardId, request.deckId);
    }

    this.updateCardFields(card, request.data);

    await this.cardRepository.save(card);

    console.log(`Successfully updated card ${request.cardId} in deck ${request.deckId}`);
    return card;
  }

  private updateCardFields(card: Card, updateData: UpdateCardRequest['data']): void {
    if (updateData.question !== undefined && updateData.question !== card.question) {
      card.updateQuestion(updateData.question);
    }

    if (updateData.answer !== undefined && updateData.answer !== card.answer) {
      card.updateAnswer(updateData.answer);
    }
  }
}
