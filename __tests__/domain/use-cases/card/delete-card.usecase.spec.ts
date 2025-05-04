import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockCardRepository } from "__tests__/@support/mocks/repositories/card-repository.mock";
import { mockDeckRepository } from "__tests__/@support/mocks/repositories/deck-repository.mock";
import { mockProgressRepository } from "__tests__/@support/mocks/repositories/progress-repository.mock";

import { Card } from "@/domain/entities/card";
import { CardNotFoundError } from "@/domain/errors/card/card-not-found-error";
import { Deck } from "@/domain/entities/deck";
import { DeckNotFoundError } from "@/domain/errors/deck/deck-not-found-error";
import { DeleteCardUseCase } from "@/domain/use-cases/card/delete-card.usecase";
import { Progress } from "@/domain/entities/progress";
import { StudyMode } from "@/domain/value-objects";

describe("DeleteCardUseCase", () => {
  const userId = "user-123";
  const deckId = "deck-123";
  const cardId = "card-123";

  const mockDeck = new Deck({
    userId,
    title: "Test Deck",
    description: "Test description",
    studyMode: new StudyMode("flashcard"),
  });
  Object.defineProperty(mockDeck, "id", { value: deckId });

  const mockCard = new Card({
    deckId,
    question: "Test question",
    answer: "Test answer",
  });
  Object.defineProperty(mockCard, "id", { value: cardId });

  const mockProgress = new Progress({
    cardId,
    deckId,
  });

  let sut: DeleteCardUseCase;

  beforeEach(() => {
    vi.resetAllMocks();

    mockDeckRepository.findByIdAndUserId.mockResolvedValue(mockDeck);
    mockCardRepository.findByIdAndDeckId.mockResolvedValue(mockCard);
    mockProgressRepository.findByCardAndDeck.mockResolvedValue(mockProgress);
    mockProgressRepository.deleteByIdAndDeckId.mockResolvedValue(undefined);
    mockCardRepository.deleteByIdAndDeckId.mockResolvedValue(undefined);

    sut = new DeleteCardUseCase(
      mockCardRepository,
      mockDeckRepository,
      mockProgressRepository
    );
  });

  it("should delete card and its progress successfully", async () => {
    const request = {
      id: cardId,
      deckId,
      userId,
    };

    await sut.execute(request);

    expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(
      deckId,
      userId
    );
    expect(mockCardRepository.findByIdAndDeckId).toHaveBeenCalledWith(
      cardId,
      deckId
    );
    expect(mockProgressRepository.findByCardAndDeck).toHaveBeenCalledWith(
      cardId,
      deckId
    );
    expect(mockProgressRepository.deleteByIdAndDeckId).toHaveBeenCalledWith(
      mockProgress.id,
      deckId
    );
    expect(mockCardRepository.deleteByIdAndDeckId).toHaveBeenCalledWith(
      cardId,
      deckId
    );
  });

  it("should throw DeckNotFoundError when deck does not exist", async () => {
    mockDeckRepository.findByIdAndUserId.mockResolvedValueOnce(null);

    const request = {
      id: cardId,
      deckId: "non-existent-deck",
      userId,
    };

    await expect(sut.execute(request)).rejects.toThrow(DeckNotFoundError);
    expect(mockCardRepository.findByIdAndDeckId).not.toHaveBeenCalled();
    expect(mockProgressRepository.deleteByIdAndDeckId).not.toHaveBeenCalled();
    expect(mockCardRepository.deleteByIdAndDeckId).not.toHaveBeenCalled();
  });

  it("should throw CardNotFoundError when card does not exist", async () => {
    mockCardRepository.findByIdAndDeckId.mockResolvedValueOnce(null);

    const request = {
      id: "non-existent-card",
      deckId,
      userId,
    };

    await expect(sut.execute(request)).rejects.toThrow(CardNotFoundError);
    expect(mockProgressRepository.deleteByIdAndDeckId).not.toHaveBeenCalled();
    expect(mockCardRepository.deleteByIdAndDeckId).not.toHaveBeenCalled();
  });

  it("should throw CardNotFoundError when card belongs to a different deck", async () => {
    const differentDeckCard = new Card({
      deckId: "different-deck",
      question: "Test question",
      answer: "Test answer",
    });
    Object.defineProperty(differentDeckCard, "id", { value: cardId });

    mockCardRepository.findByIdAndDeckId.mockResolvedValueOnce(
      differentDeckCard
    );

    const request = {
      id: cardId,
      deckId,
      userId,
    };

    await expect(sut.execute(request)).rejects.toThrow(CardNotFoundError);
    expect(mockProgressRepository.deleteByIdAndDeckId).not.toHaveBeenCalled();
    expect(mockCardRepository.deleteByIdAndDeckId).not.toHaveBeenCalled();
  });

  it("should continue deleting card even if progress deletion fails", async () => {
    mockProgressRepository.deleteByIdAndDeckId.mockRejectedValueOnce(
      new Error("Progress deletion failed")
    );

    const request = {
      id: cardId,
      deckId,
      userId,
    };

    await sut.execute(request);

    expect(mockProgressRepository.deleteByIdAndDeckId).toHaveBeenCalledWith(
      mockProgress.id,
      deckId
    );
    expect(mockCardRepository.deleteByIdAndDeckId).toHaveBeenCalledWith(
      cardId,
      deckId
    );
  });
});
