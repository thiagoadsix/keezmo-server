import { beforeEach, describe, expect, it, vi } from "vitest";

import { Card } from "@/domain/entities/card";
import { FindDueCardsUseCase } from "@/domain/use-cases/progress/find-due-cards.usecase";
import { Progress } from "@/domain/entities/progress";

import { mockCardRepository } from "__tests__/@support/mocks/repositories/card-repository.mock";
import { mockProgressRepository } from "__tests__/@support/mocks/repositories/progress-repository.mock";

describe("FindDueCardsUseCase", () => {
  let sut: FindDueCardsUseCase;
  const today = new Date("2023-05-15T12:00:00Z");

  const mockDeckId = "123e4567-e89b-12d3-a456-426614174000";

  const mockProgress1 = new Progress({
    cardId: "card-1",
    deckId: mockDeckId,
    interval: 10,
    repetitions: 3,
    easeFactor: 2.5,
    nextReview: "2023-05-15T10:00:00Z",
  });

  const mockProgress2 = new Progress({
    cardId: "card-2",
    deckId: mockDeckId,
    interval: 5,
    repetitions: 2,
    easeFactor: 2.2,
    nextReview: "2023-05-14T12:00:00Z",
  });

  const mockCard1 = new Card({
    deckId: mockDeckId,
    question: "Question 1",
    answer: "Answer 1",
  });

  const mockCard2 = new Card({
    deckId: mockDeckId,
    question: "Question 2",
    answer: "Answer 2",
  });

  const mockCard3 = new Card({
    deckId: mockDeckId,
    question: "Question 3",
    answer: "Answer 3",
  });

  Object.defineProperty(mockCard1, "id", { value: "card-1" });
  Object.defineProperty(mockCard2, "id", { value: "card-2" });
  Object.defineProperty(mockCard3, "id", { value: "card-3" });

  beforeEach(() => {
    vi.setSystemTime(today);
    vi.resetAllMocks();

    sut = new FindDueCardsUseCase(mockProgressRepository, mockCardRepository);
  });

  it("should return due cards ordered by interval (highest first)", async () => {
    mockProgressRepository.findDueCards.mockResolvedValue([
      mockProgress1,
      mockProgress2,
    ]);

    mockCardRepository.findByIdAndDeckId.mockResolvedValueOnce(mockCard1);
    mockCardRepository.findByIdAndDeckId.mockResolvedValueOnce(mockCard2);

    const result = await sut.execute({ date: today, deckId: mockDeckId });

    expect(mockProgressRepository.findDueCards).toHaveBeenCalledWith(
      today,
      mockDeckId
    );
    expect(mockCardRepository.findByIdAndDeckId).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(2);

    expect(result[0].progress.interval).toBe(10);
    expect(result[1].progress.interval).toBe(5);
    expect(result[0].card.question).toBe("Question 1");
    expect(result[1].card.question).toBe("Question 2");
  });

  it("should return empty array when no due cards found", async () => {
    mockProgressRepository.findDueCards.mockResolvedValue([]);

    const result = await sut.execute({ deckId: mockDeckId });

    expect(result).toEqual([]);

    expect(mockCardRepository.findByIdAndDeckId).not.toHaveBeenCalled();
  });

  it("should exclude cards that could not be found", async () => {
    mockProgressRepository.findDueCards.mockResolvedValue([
      mockProgress1,
      mockProgress2,
    ]);

    mockCardRepository.findByIdAndDeckId.mockResolvedValueOnce(mockCard1);
    mockCardRepository.findByIdAndDeckId.mockResolvedValueOnce(null);

    const result = await sut.execute({ deckId: mockDeckId });

    expect(result).toHaveLength(1);
    expect(result[0].card.id).toBe("card-1");
  });

  it("should use current date when no date provided", async () => {
    mockProgressRepository.findDueCards.mockResolvedValue([]);

    await sut.execute({ deckId: mockDeckId });

    expect(mockProgressRepository.findDueCards).toHaveBeenCalledWith(
      today,
      mockDeckId
    );
  });
});
