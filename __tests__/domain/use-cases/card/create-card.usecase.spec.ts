import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockCardRepository } from "__tests__/@support/mocks/repositories/card-repository.mock";
import { mockDeckRepository } from "__tests__/@support/mocks/repositories/deck-repository.mock";
import { mockProgressRepository } from "__tests__/@support/mocks/repositories/progress-repository.mock";

import { Card } from "@/domain/entities/card";
import { CreateCardUseCase } from "@/domain/use-cases/card/create-card.usecase";
import { DeckNotFoundError } from "@/domain/errors/deck/deck-not-found-error";
import { Progress } from "@/domain/entities/progress";

describe("CreateCardUseCase", () => {
  const userId = "user-123";
  const deckId = "deck-123";
  const validCardData = {
    question: "Test question",
    answer: "Test answer",
  };

  let sut: CreateCardUseCase;

  beforeEach(() => {
    vi.resetAllMocks();

    mockDeckRepository.findByIdAndUserId.mockResolvedValue({
      id: deckId,
      userId,
    });
    mockCardRepository.save.mockResolvedValue(undefined);
    mockProgressRepository.save.mockResolvedValue(undefined);

    sut = new CreateCardUseCase(
      mockCardRepository,
      mockDeckRepository,
      mockProgressRepository
    );
  });

  it("should create a card and its initial progress successfully", async () => {
    const request = {
      deckId,
      userId,
      data: validCardData,
    };

    const result = await sut.execute(request);

    expect(result).toHaveProperty("card");
    expect(result).toHaveProperty("progress");
    expect(result.card).toBeInstanceOf(Card);
    expect(result.progress).toBeInstanceOf(Progress);
    expect(result.card.question).toBe(validCardData.question);
    expect(result.card.answer).toBe(validCardData.answer);
    expect(result.card.deckId).toBe(deckId);
    expect(result.progress.cardId).toBe(result.card.id);
    expect(result.progress.deckId).toBe(deckId);
    expect(result.progress.repetitions).toBe(0);

    expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(
      deckId,
      userId
    );
    expect(mockCardRepository.save).toHaveBeenCalledWith(expect.any(Card));
    expect(mockProgressRepository.save).toHaveBeenCalledWith(
      expect.any(Progress)
    );
  });

  it("should throw DeckNotFoundError when deck does not exist", async () => {
    mockDeckRepository.findByIdAndUserId.mockResolvedValueOnce(null);

    const request = {
      deckId: "non-existent-deck",
      userId,
      data: validCardData,
    };

    await expect(sut.execute(request)).rejects.toThrow(DeckNotFoundError);
    expect(mockCardRepository.save).not.toHaveBeenCalled();
    expect(mockProgressRepository.save).not.toHaveBeenCalled();
  });
});
