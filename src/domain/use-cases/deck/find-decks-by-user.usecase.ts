import {
  CardRepository,
  DeckRepository,
} from '@/domain/interfaces/repositories';
import { Card } from '@/domain/entities/card';
import { Deck } from '@/domain/entities/deck';

interface FindDecksByUserRequest {
  userId: string;
}

type FindDecksByUserResponse = Deck[];

export class FindDecksByUserUseCase {
  constructor(
    private readonly deckRepository: DeckRepository,
    private readonly cardRepository: CardRepository
  ) {}

  async execute(request: FindDecksByUserRequest): Promise<FindDecksByUserResponse> {
    console.log(`Starting FindDecksByUserUseCase for userId: ${request.userId}`);

    const decks = await this.deckRepository.findAllByUser(request.userId);
    const deckIds = decks.map((deck) => deck.id);
    const cards = await this.cardRepository.findByDeckIds(deckIds);

    decks.forEach((deck) => {
      const deckCards = cards.filter((card: Card) => card.deckId === deck.id);
      deck.addCards(deckCards);
    });

    console.log(`Found ${decks.length} decks for user ${request.userId}`);
    console.log(`Found ${cards.length} cards for user ${request.userId}`);

    return decks;
  }
}
