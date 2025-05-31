import { CardRepository, DeckRepository, StudySessionRepository } from '@/domain/interfaces/repositories';
import { Card } from '@/domain/entities/card';
import { Deck } from '@/domain/entities/deck';
import { StudySession } from '@/domain/entities/study-session';

interface FindStudySessionsByUserRequest {
  userId: string;
}

type FindStudySessionsByUserResponse = StudySession[];

export class FindStudySessionsByUserUseCase {
  constructor(
    private readonly studySessionRepository: StudySessionRepository,
    private readonly deckRepository: DeckRepository,
    private readonly cardRepository: CardRepository,
  ) {}

  async execute(request: FindStudySessionsByUserRequest): Promise<FindStudySessionsByUserResponse> {
    console.log(`Starting FindStudySessionsByUserUseCase for userId: ${request.userId}`);

    const studySessions = await this.studySessionRepository.findByUserId(request.userId);

    console.log(`Found ${studySessions.length} study sessions for user ${request.userId}`);

    const decks = await this.deckRepository.findAllByUser(request.userId);
    const cards = await this.cardRepository.findByDeckIds(decks.map((deck) => deck.id));

    console.log({decks, cards})

    const decksWithCards = decks.map((deck) => {
      const cardsForDeck = cards.filter((card: Card) => card.deckId === deck.id);
      return new Deck({
        ...deck,
        cards: cardsForDeck,
      });
    });

    return studySessions.map((session) => {
      const deck = decksWithCards.find((deck) => deck.id === session.deckId);
      return new StudySession({
        ...session,
        deck,
      });
    });
  }
}
