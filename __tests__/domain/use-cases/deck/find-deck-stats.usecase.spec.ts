import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockCardRepository } from "__tests__/@support/mocks/repositories/card-repository.mock";
import { mockDeckRepository } from "__tests__/@support/mocks/repositories/deck-repository.mock";
import { mockProgressRepository } from "__tests__/@support/mocks/repositories/progress-repository.mock";

import {
  CardRepository,
  DeckRepository,
  ProgressRepository,
} from "@/domain/interfaces/repositories";
import { Card } from "@/domain/entities/card";
import { Deck } from "@/domain/entities/deck";
import { DeckNotFoundError } from "@/domain/errors/deck/deck-not-found-error";
import { FindDeckStatsUseCase } from "@/domain/use-cases/deck/find-deck-stats.usecase";
import { Progress } from "@/domain/entities/progress";
import { StudyMode } from "@/domain/value-objects";

describe("FindDeckStatsUseCase", () => {
  let deckRepository: DeckRepository;
  let cardRepository: CardRepository;
  let progressRepository: ProgressRepository;
  let sut: FindDeckStatsUseCase;

  const userId = "user-123";
  const deckId = "deck-123";
  const mockDeck = new Deck({
    userId,
    title: "Test Deck",
    description: "A test deck for statistics",
    studyMode: new StudyMode("flashcard"),
  });

  Object.defineProperty(mockDeck, "id", { value: deckId });

  const mockCards: Card[] = Array(10)
    .fill(0)
    .map((_, index) => {
      const card = new Card({
        deckId,
        question: `Question ${index + 1}`,
        answer: `Answer ${index + 1}`,
      });

      Object.defineProperty(card, "id", { value: `card-${index + 1}` });
      return card;
    });

  const today = new Date();
  const todayString = today.toISOString();

  const mockProgressRecords: (Progress | null)[] = [
    null,
    null,
    null,

    new Progress({
      cardId: "card-4",
      deckId,
      repetitions: 1,
      interval: 1,
      easeFactor: 2.5,
      nextReview: todayString,
    }),
    new Progress({
      cardId: "card-5",
      deckId,
      repetitions: 2,
      interval: 6,
      easeFactor: 2.6,
      nextReview: todayString,
    }),
    new Progress({
      cardId: "card-6",
      deckId,
      repetitions: 2,
      interval: 3,
      easeFactor: 2.3,
      nextReview: todayString,
    }),

    new Progress({
      cardId: "card-7",
      deckId,
      repetitions: 3,
      interval: 15,
      easeFactor: 2.7,
      nextReview: todayString,
    }),
    new Progress({
      cardId: "card-8",
      deckId,
      repetitions: 5,
      interval: 30,
      easeFactor: 2.8,
      nextReview: todayString,
    }),
    new Progress({
      cardId: "card-9",
      deckId,
      repetitions: 8,
      interval: 60,
      easeFactor: 2.9,
      nextReview: todayString,
    }),
    new Progress({
      cardId: "card-10",
      deckId,
      repetitions: 12,
      interval: 120,
      easeFactor: 3.0,
      nextReview: todayString,
    }),
  ];

  const mockDueProgress = mockProgressRecords.filter(
    (p): p is Progress =>
      p !== null && ["card-4", "card-5", "card-6", "card-7"].includes(p.cardId)
  );

  beforeEach(() => {
    deckRepository = mockDeckRepository;
    cardRepository = mockCardRepository;
    progressRepository = mockProgressRepository;

    vi.mocked(deckRepository.findByIdAndUserId).mockResolvedValue(mockDeck);
    vi.mocked(cardRepository.findByDeckId).mockResolvedValue(mockCards);
    vi.mocked(progressRepository.findByCardAndDeck).mockImplementation(
      (cardId: string) => {
        const index = Number(cardId.split("-")[1]) - 1;
        return Promise.resolve(mockProgressRecords[index]);
      }
    );
    vi.mocked(progressRepository.findDueCards).mockResolvedValue(
      mockDueProgress
    );

    sut = new FindDeckStatsUseCase(
      deckRepository,
      cardRepository,
      progressRepository
    );
  });

  it("should return correct statistics for a deck", async () => {
    const request = {
      deckId,
      userId,
    };

    const result = await sut.execute(request);

    expect(deckRepository.findByIdAndUserId).toHaveBeenCalledWith(
      deckId,
      userId
    );
    expect(cardRepository.findByDeckId).toHaveBeenCalledWith(deckId);
    expect(progressRepository.findDueCards).toHaveBeenCalled();
    expect(result.deck.id).toBe(deckId);
    expect(result.deck.title).toBe("Test Deck");
    expect(result.cards.total).toBe(10);
    expect(result.cards.new).toBe(3);
    expect(result.cards.learning).toBe(3);
    expect(result.cards.mature).toBe(4);
    expect(result.cards.due).toBe(4);
    expect(result.performance.successRate).toBeGreaterThan(0);
    expect(result.performance.averageEaseFactor).toBeCloseTo(2.68, 1);
    expect(result.performance.currentStreak).toBe(0);
    expect(result.forecast).toBeInstanceOf(Array);
    expect(result.forecast.length).toBe(7);
    expect(result.forecast[0].count).toBe(4);
  });

  it("should throw DeckNotFoundError if deck does not exist", async () => {
    vi.mocked(deckRepository.findByIdAndUserId).mockResolvedValueOnce(null);
    vi.mocked(cardRepository.findByDeckId).mockReset();
    vi.mocked(progressRepository.findDueCards).mockReset();

    const request = {
      deckId: "non-existent-deck",
      userId,
    };

    await expect(sut.execute(request)).rejects.toThrow(DeckNotFoundError);
    expect(cardRepository.findByDeckId).not.toHaveBeenCalled();
  });

  it("should handle deck with no cards", async () => {
    vi.mocked(cardRepository.findByDeckId).mockResolvedValueOnce([]);
    vi.mocked(progressRepository.findDueCards).mockResolvedValueOnce([]);

    const request = {
      deckId,
      userId,
    };

    const result = await sut.execute(request);

    expect(result.cards.total).toBe(0);
    expect(result.cards.new).toBe(0);
    expect(result.cards.learning).toBe(0);
    expect(result.cards.mature).toBe(0);
    expect(result.cards.due).toBe(0);
    expect(result.performance.averageEaseFactor).toBe(2.5);
    expect(result.performance.successRate).toBe(0);
  });

  it("should handle deck with cards but no progress", async () => {
    vi.mocked(progressRepository.findByCardAndDeck).mockResolvedValue(null);
    vi.mocked(progressRepository.findDueCards).mockResolvedValueOnce([]);

    const request = {
      deckId,
      userId,
    };

    const result = await sut.execute(request);

    expect(result.cards.total).toBe(10);
    expect(result.cards.new).toBe(10);
    expect(result.cards.learning).toBe(0);
    expect(result.cards.mature).toBe(0);
    expect(result.cards.due).toBe(0);
    expect(result.performance.averageEaseFactor).toBe(2.5);
    expect(result.performance.successRate).toBe(0);
  });
});
