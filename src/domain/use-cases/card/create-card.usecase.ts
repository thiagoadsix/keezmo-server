import { CardRepository, DeckRepository, ProgressRepository } from '@/domain/interfaces/repositories';
import { Card } from '@/domain/entities/card';
import { DeckNotFoundError } from '@/domain/errors/deck/deck-not-found-error';
import { Progress } from '@/domain/entities/progress';

interface CardData {
  question: string;
  answer: string;
}

interface CreateCardRequest {
  deckId: string;
  userId: string;
  data: CardData;
}

interface CreateCardResponse {
  card: Card;
  progress: Progress;
}

export class CreateCardUseCase {
  constructor(
    private cardRepository: CardRepository,
    private deckRepository: DeckRepository,
    private progressRepository: ProgressRepository
  ) {}

  async execute(request: CreateCardRequest): Promise<CreateCardResponse> {
    const { deckId, userId, data } = request;

    console.log(`Starting CreateCardUseCase for deckId: ${deckId}`);

    const deck = await this.deckRepository.findByIdAndUserId(deckId, userId);
    if (!deck) {
      throw new DeckNotFoundError(deckId, userId);
    }

    const card = new Card({
      deckId,
      question: data.question,
      answer: data.answer,
    });

    const progress = new Progress({
      cardId: card.id,
      deckId,
      repetitions: 0,
    });

    await Promise.all([this.cardRepository.save(card), this.progressRepository.save(progress)]);

    console.log(`Successfully created card ${card.id} in deck ${deckId}`);

    return {
      card,
      progress,
    };
  }
}
