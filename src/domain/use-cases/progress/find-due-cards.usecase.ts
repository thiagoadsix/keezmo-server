import {
  CardRepository,
  ProgressRepository,
} from "@/domain/interfaces/repositories";
import { Card } from "@/domain/entities/card";
import { Progress } from "@/domain/entities/progress";

export interface DueCard {
  card: Card;
  progress: Progress;
}

type FindDueCardsRequest = {
  date?: Date;
  deckId?: string;
};

type FindDueCardsResponse = DueCard[];

export class FindDueCardsUseCase {
  constructor(
    private readonly progressRepository: ProgressRepository,
    private readonly cardRepository: CardRepository
  ) {}

  public async execute({
    date = new Date(),
    deckId,
  }: FindDueCardsRequest = {}): Promise<FindDueCardsResponse> {
    console.log(
      `Finding due cards for date=${date.toISOString()}${
        deckId ? ` in deck=${deckId}` : ""
      }`
    );

    const dueProgresses = await this.progressRepository.findDueCards(
      date,
      deckId
    );

    console.log(`Found ${dueProgresses.length} due progress records`);

    if (dueProgresses.length === 0) {
      return [];
    }

    const cardIds = [
      ...new Set(dueProgresses.map((progress) => progress.cardId)),
    ];

    const cards = await Promise.all(
      cardIds.map((cardId) =>
        this.cardRepository.findByIdAndDeckId(cardId, deckId ?? "")
      )
    );

    const validCards = cards.filter((card): card is Card => card !== null);

    const cardMap = new Map<string, Card>();
    validCards.forEach((card) => cardMap.set(card.id, card));

    const dueCards: DueCard[] = [];
    for (const progress of dueProgresses) {
      const card = cardMap.get(progress.cardId);
      if (card) {
        dueCards.push({ card, progress });
      }
    }

    const sortedDueCards = dueCards.sort(
      (a, b) => b.progress.interval - a.progress.interval
    );

    console.log(`Returning ${sortedDueCards.length} due cards`);

    return sortedDueCards;
  }
}
