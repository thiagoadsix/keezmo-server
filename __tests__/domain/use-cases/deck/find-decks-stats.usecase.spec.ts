import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Card } from "@/domain/entities/card";
import { Deck } from "@/domain/entities/deck";
import { Progress } from "@/domain/entities/progress";

import { StudyMode, StudyModeEnum } from "@/domain/value-objects";

import { mockCardRepository } from "__tests__/@support/mocks/repositories/card-repository.mock";
import { mockDeckRepository } from "__tests__/@support/mocks/repositories/deck-repository.mock";
import { mockProgressRepository } from "__tests__/@support/mocks/repositories/progress-repository.mock";

import { FindDecksStatsUseCase } from "@/domain/use-cases/deck/find-decks-stats.usecase";

describe("FindDecksStatsUseCase", () => {
  let sut: FindDecksStatsUseCase;

  beforeEach(() => {
    vi.resetAllMocks();

    sut = new FindDecksStatsUseCase(
      mockDeckRepository,
      mockCardRepository,
      mockProgressRepository
    );

    const fixedDate = new Date("2023-05-15T10:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return empty stats when user has no decks", async () => {
    const userId = "user-123";
    vi.mocked(mockDeckRepository.findAllByUser).mockResolvedValueOnce([]);

    const result = await sut.execute({ userId });

    expect(mockDeckRepository.findAllByUser).toHaveBeenCalledWith(userId);
    expect(result.decks).toEqual([]);
    expect(result.totalCards).toBe(0);
    expect(result.totalDueCards).toBe(0);
  });

  it("should return stats for all user decks", async () => {
    const userId = "user-123";

    const deck1 = new Deck({
      id: "deck-1",
      title: "Deck 1",
      description: "Description 1",
      userId,
      studyMode: new StudyMode(StudyModeEnum.FLASHCARD),
    });

    const deck2 = new Deck({
      id: "deck-2",
      title: "Deck 2",
      description: "Description 2",
      userId,
      studyMode: new StudyMode(StudyModeEnum.MULTIPLE_CHOICE),
    });

    vi.mocked(mockDeckRepository.findAllByUser).mockResolvedValueOnce([deck1, deck2]);

    const deck1Cards = [
      new Card({
        id: "card-1",
        question: "Question 1",
        answer: "Answer 1",
        deckId: "deck-1",
      }),
      new Card({
        id: "card-2",
        question: "Question 2",
        answer: "Answer 2",
        deckId: "deck-1",
      }),
    ];

    const deck2Cards = [
      new Card({
        id: "card-3",
        question: "Question 3",
        answer: "Answer 3",
        deckId: "deck-2",
      }),
    ];

    vi.mocked(mockCardRepository.findByDeckId).mockImplementation((deckId) => {
      if (deckId === "deck-1") return Promise.resolve(deck1Cards);
      if (deckId === "deck-2") return Promise.resolve(deck2Cards);
      return Promise.resolve([]);
    });

    const progress1 = new Progress({
      id: "progress-1",
      cardId: "card-1",
      deckId: "deck-1",
      easeFactor: 2.5,
      interval: 1,
      repetitions: 1,
      nextReview: new Date("2023-05-15").toISOString(),
    });

    const progress2 = new Progress({
      id: "progress-2",
      cardId: "card-2",
      deckId: "deck-1",
      easeFactor: 2.3,
      interval: 3,
      repetitions: 2,
      nextReview: new Date("2023-05-16").toISOString(),
    });

    const progress3 = new Progress({
      id: "progress-3",
      cardId: "card-3",
      deckId: "deck-2",
      easeFactor: 2.1,
      interval: 10,
      repetitions: 5,
      nextReview: new Date("2023-05-15").toISOString(),
    });

    vi.mocked(mockProgressRepository.findDueCards).mockImplementation((date, deckId) => {
      if (deckId === "deck-1") return Promise.resolve([progress1]);
      if (deckId === "deck-2") return Promise.resolve([progress3]);
      return Promise.resolve([]);
    });

    vi.mocked(mockProgressRepository.findByCardAndDeck).mockImplementation((cardId, deckId) => {
      if (cardId === "card-1" && deckId === "deck-1") return Promise.resolve(progress1);
      if (cardId === "card-2" && deckId === "deck-1") return Promise.resolve(progress2);
      if (cardId === "card-3" && deckId === "deck-2") return Promise.resolve(progress3);
      return Promise.resolve(null);
    });

    const result = await sut.execute({ userId });

    expect(mockDeckRepository.findAllByUser).toHaveBeenCalledWith(userId);
    expect(mockCardRepository.findByDeckId).toHaveBeenCalledTimes(2);
    expect(mockProgressRepository.findDueCards).toHaveBeenCalledTimes(2);

    expect(result.decks).toHaveLength(2);
    expect(result.totalCards).toBe(3);
    expect(result.totalDueCards).toBe(2);

    const deck1Stats = result.decks[0];
    expect(deck1Stats.deck.id).toBe("deck-1");
    expect(deck1Stats.deck.title).toBe("Deck 1");
    expect(deck1Stats.cards.total).toBe(2);
    expect(deck1Stats.cards.new).toBe(0);
    expect(deck1Stats.cards.learning).toBe(2);
    expect(deck1Stats.cards.mature).toBe(0);
    expect(deck1Stats.cards.due).toBe(1);
    expect(deck1Stats.performance.averageEaseFactor).toBeCloseTo(2.4);
    expect(deck1Stats.forecast).toHaveLength(7);

    const deck2Stats = result.decks[1];
    expect(deck2Stats.deck.id).toBe("deck-2");
    expect(deck2Stats.deck.title).toBe("Deck 2");
    expect(deck2Stats.cards.total).toBe(1);
    expect(deck2Stats.cards.new).toBe(0);
    expect(deck2Stats.cards.learning).toBe(0);
    expect(deck2Stats.cards.mature).toBe(1);
    expect(deck2Stats.cards.due).toBe(1);
    expect(deck2Stats.performance.averageEaseFactor).toBe(2.1);
    expect(deck2Stats.forecast).toHaveLength(7);
  });

  it("should handle decks with no cards", async () => {
    const userId = "user-123";

    const emptyDeck = new Deck({
      id: "empty-deck",
      title: "Empty Deck",
      description: "No cards",
      userId,
      studyMode: new StudyMode(StudyModeEnum.FLASHCARD),
    });

    vi.mocked(mockDeckRepository.findAllByUser).mockResolvedValueOnce([emptyDeck]);
    vi.mocked(mockCardRepository.findByDeckId).mockResolvedValueOnce([]);
    vi.mocked(mockProgressRepository.findDueCards).mockResolvedValueOnce([]);

    const result = await sut.execute({ userId });

    expect(result.decks).toHaveLength(1);
    expect(result.totalCards).toBe(0);
    expect(result.totalDueCards).toBe(0);

    const deckStats = result.decks[0];
    expect(deckStats.cards.total).toBe(0);
    expect(deckStats.cards.due).toBe(0);
    expect(deckStats.performance.successRate).toBe(0);
    expect(deckStats.performance.averageEaseFactor).toBe(2.5);
  });

  it("should handle decks with new cards (no progress)", async () => {
    const userId = "user-123";

    const deck = new Deck({
      id: "deck-1",
      title: "New Cards",
      description: "Only new cards",
      userId,
      studyMode: new StudyMode(StudyModeEnum.FLASHCARD),
    });

    vi.mocked(mockDeckRepository.findAllByUser).mockResolvedValueOnce([deck]);

    const cards = [
      new Card({
        id: "card-1",
        question: "Question 1",
        answer: "Answer 1",
        deckId: "deck-1",
      }),
      new Card({
        id: "card-2",
        question: "Question 2",
        answer: "Answer 2",
        deckId: "deck-1",
      }),
    ];

    vi.mocked(mockCardRepository.findByDeckId).mockResolvedValueOnce(cards);
    vi.mocked(mockProgressRepository.findDueCards).mockResolvedValueOnce([]);
    vi.mocked(mockProgressRepository.findByCardAndDeck).mockResolvedValue(null);

    const result = await sut.execute({ userId });

    expect(result.decks).toHaveLength(1);
    expect(result.totalCards).toBe(2);
    expect(result.totalDueCards).toBe(0);

    const deckStats = result.decks[0];
    expect(deckStats.cards.total).toBe(2);
    expect(deckStats.cards.new).toBe(2);
    expect(deckStats.cards.learning).toBe(0);
    expect(deckStats.cards.mature).toBe(0);
    expect(deckStats.performance.successRate).toBe(0);
    expect(deckStats.performance.averageEaseFactor).toBe(2.5);
  });
});