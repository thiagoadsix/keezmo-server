import { CardRepository, DeckRepository } from '@/domain/interfaces/repositories';
import { Card } from '@/domain/entities/card';
import { CardNotFoundError } from '@/domain/errors/card/card-not-found-error';
import { DeckNotFoundError } from '@/domain/errors/deck/deck-not-found-error';

interface CardToUpdate {
  id: string;
  question?: string;
  answer?: string;
}

interface UpdateCardsRequest {
  deckId: string;
  cards: CardToUpdate[];
}

type UpdateCardsResponse = Card[];

export class UpdateCardsUseCase {
  constructor(private readonly cardRepository: CardRepository, private readonly deckRepository: DeckRepository) {}

  async execute(request: UpdateCardsRequest): Promise<UpdateCardsResponse> {
    console.log(`Starting UpdateCardsUseCase for deckId: ${request.deckId} with ${request.cards.length} cards`);

    const deck = await this.deckRepository.findById(request.deckId);

    if (!deck) {
      console.log(`Deck with ID ${request.deckId} not found`);
      throw new DeckNotFoundError(request.deckId, 'unknown');
    }

    const existingCards = await this.cardRepository.findByDeckId(request.deckId);
    console.log(`Found ${existingCards.length} existing cards in deck ${request.deckId}`);

    const cardsById = new Map<string, Card>();
    existingCards.forEach(card => cardsById.set(card.id, card));

    const updatedCards: Card[] = [];

    for (const cardToUpdate of request.cards) {
      const existingCard = cardsById.get(cardToUpdate.id);

      if (!existingCard) {
        console.log(`Card with ID ${cardToUpdate.id} not found in deck ${request.deckId}`);
        throw new CardNotFoundError(cardToUpdate.id, request.deckId);
      }

      this.updateCardFields(existingCard, cardToUpdate);

      await this.cardRepository.save(existingCard);
      updatedCards.push(existingCard);
    }

    console.log(`Successfully updated ${updatedCards.length} cards in deck ${request.deckId}`);
    return updatedCards;
  }

  private updateCardFields(card: Card, updateData: CardToUpdate): void {
    if (updateData.question !== undefined && updateData.question !== card.question) {
      card.updateQuestion(updateData.question);
    }

    if (updateData.answer !== undefined && updateData.answer !== card.answer) {
      card.updateAnswer(updateData.answer);
    }
  }
}
