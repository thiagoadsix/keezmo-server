import {
  CardRepository,
  DeckRepository,
  ProgressRepository,
} from "@/domain/interfaces/repositories";
import { Card } from "@/domain/entities/card";
import { DeckNotFoundError } from "@/domain/errors/deck/deck-not-found-error";
import { Progress } from "@/domain/entities/progress";

import {
  DEFAULT_EASE_FACTOR,
  MATURE_CARD_THRESHOLD,
} from "@/shared/constants/srs";
import { addDays, formatDateToYYYYMMDD } from "@/shared/utils/date";

interface FindDeckStatsRequest {
  id: string;
  userId: string;
}

interface DeckData {
  id: string;
  title: string;
}

interface CardCounts {
  total: number;
  new: number;
  learning: number;
  mature: number;
  due: number;
}

interface PerformanceMetrics {
  successRate: number;
  averageEaseFactor: number;
  currentStreak: number;
}

interface ForecastDay {
  date: string;
  count: number;
}

interface FindDeckStatsResponse {
  deck: DeckData;
  cards: CardCounts;
  performance: PerformanceMetrics;
  forecast: ForecastDay[];
}

export class FindDeckStatsUseCase {
  constructor(
    private deckRepository: DeckRepository,
    private cardRepository: CardRepository,
    private progressRepository: ProgressRepository
  ) {}

  async execute(request: FindDeckStatsRequest): Promise<FindDeckStatsResponse> {
    const { id, userId } = request;

    console.log(`Finding stats for deck: ${id}, user: ${userId}`);

    const deck = await this.deckRepository.findByIdAndUserId(id, userId);
    if (!deck) {
      throw new DeckNotFoundError(id, userId);
    }

    const cards = await this.cardRepository.findByDeckId(id);

    const today = new Date();
    const dueProgresses = await this.progressRepository.findDueCards(today, id);
    const dueCardsCount = dueProgresses.length;

    let newCards = 0;
    let learningCards = 0;
    let matureCards = 0;

    let totalEaseFactor = 0;
    let cardsWithProgressCount = 0;

    await Promise.all(
      cards.map(async (card) => {
        const progress = await this.progressRepository.findByCardAndDeck(
          card.id,
          id
        );

        if (!progress) {
          newCards++;
          return;
        }

        cardsWithProgressCount++;
        totalEaseFactor += progress.easeFactor;

        if (progress.repetitions < MATURE_CARD_THRESHOLD) {
          learningCards++;
        } else {
          matureCards++;
        }
      })
    );

    const averageEaseFactor =
      cardsWithProgressCount > 0
        ? totalEaseFactor / cardsWithProgressCount
        : DEFAULT_EASE_FACTOR;

    const successRate = this.calculateSuccessRate(
      cards,
      cardsWithProgressCount
    );

    const forecast = this.generateForecast(id, dueProgresses);

    const response: FindDeckStatsResponse = {
      deck: {
        id: deck.id,
        title: deck.title,
      },
      cards: {
        total: cards.length,
        new: newCards,
        learning: learningCards,
        mature: matureCards,
        due: dueCardsCount,
      },
      performance: {
        successRate,
        averageEaseFactor,
        currentStreak: 0,
      },
      forecast,
    };

    console.log(`Successfully retrieved stats for deck: ${id}`);
    return response;
  }

  private calculateSuccessRate(
    cards: Card[],
    cardsWithProgressCount: number
  ): number {
    if (cards.length === 0 || cardsWithProgressCount === 0) {
      return 0;
    }

    return (cardsWithProgressCount / cards.length) * 100;
  }

  private generateForecast(
    deckId: string,
    dueProgresses: Progress[]
  ): ForecastDay[] {
    const forecast: ForecastDay[] = [];
    const today = new Date();

    forecast.push({
      date: formatDateToYYYYMMDD(today),
      count: dueProgresses.length,
    });

    for (let i = 1; i < 7; i++) {
      const forecastDate = addDays(today, i);
      const dateString = formatDateToYYYYMMDD(forecastDate);

      const estimatedCount = Math.max(
        0,
        Math.floor(dueProgresses.length * (0.7 - i * 0.1))
      );

      forecast.push({
        date: dateString,
        count: estimatedCount,
      });
    }

    return forecast;
  }
}
