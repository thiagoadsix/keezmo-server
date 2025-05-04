import {
  generateIdMock,
  mockId,
} from "__tests__/@support/mocks/shared/utils/generate-id.mock";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  validDeckProps,
  validDeckWithCardsProps,
} from "__tests__/@support/fixtures/deck.fixtures";
import { mockCardRepository } from "__tests__/@support/mocks/repositories/card-repository.mock";
import { mockDeckRepository } from "__tests__/@support/mocks/repositories/deck-repository.mock";
import { mockProgressRepository } from "__tests__/@support/mocks/repositories/progress-repository.mock";

import { Deck } from "@/domain/entities/deck";
import { DeckNotFoundError } from "@/domain/errors/deck/deck-not-found-error";
import { DeleteDeckUseCase } from "@/domain/use-cases/deck/delete-deck.usecase";

describe("DeleteDeckUseCase", () => {
  let useCase: DeleteDeckUseCase;
  let mockDeck: Deck;
  let mockDeckWithCards: Deck;
  const userId = "user-123";

  beforeEach(() => {
    useCase = new DeleteDeckUseCase(
      mockDeckRepository,
      mockCardRepository,
      mockProgressRepository
    );
    vi.useFakeTimers();
    generateIdMock.mockReturnValue(mockId);

    mockDeck = new Deck(validDeckProps);
    mockDeckWithCards = new Deck(validDeckWithCardsProps);

    mockDeckRepository.findByIdAndUserId.mockResolvedValue(mockDeck);
    mockDeckRepository.deleteByUser.mockResolvedValue(undefined);
    mockCardRepository.deleteByIds.mockResolvedValue(undefined);
    mockProgressRepository.deleteByDeckId.mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  describe("Unit Tests", () => {
    it("should delete a deck without cards", async () => {
      const request = { id: mockId, userId };

      await useCase.execute(request);

      expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(
        mockId,
        userId
      );
      expect(mockCardRepository.deleteByIds).not.toHaveBeenCalled();
      expect(mockDeckRepository.deleteByUser).toHaveBeenCalledWith(
        mockId,
        userId
      );
    });

    it("should delete a deck with its cards and progress", async () => {
      const request = { id: mockId, userId };
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(mockDeckWithCards);

      const cardIds = mockDeckWithCards.cards.map((card) => card.id);

      await useCase.execute(request);

      expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(
        mockId,
        userId
      );
      expect(mockCardRepository.deleteByIds).toHaveBeenCalledWith(cardIds);
      expect(mockDeckRepository.deleteByUser).toHaveBeenCalledWith(
        mockId,
        userId
      );
      expect(mockProgressRepository.deleteByDeckId).toHaveBeenCalledWith(
        mockId
      );
    });

    it("should throw DeckNotFoundError when deck is not found", async () => {
      const request = { id: mockId, userId };
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(null);

      const promise = useCase.execute(request);

      await expect(promise).rejects.toThrow(DeckNotFoundError);
      await expect(promise).rejects.toThrow(
        `Deck with ID ${mockId} not found for user ${userId}`
      );
      expect(mockCardRepository.deleteByIds).not.toHaveBeenCalled();
      expect(mockDeckRepository.deleteByUser).not.toHaveBeenCalled();
    });
  });

  describe("BDD Scenarios", () => {
    it("Given a deck without cards, When execute is called, Then only the deck is deleted", async () => {
      const request = { id: mockId, userId };

      await useCase.execute(request);

      expect(mockCardRepository.deleteByIds).not.toHaveBeenCalled();
      expect(mockDeckRepository.deleteByUser).toHaveBeenCalledWith(
        mockId,
        userId
      );
    });

    it("Given a deck with cards, When execute is called, Then both cards and deck are deleted", async () => {
      const request = { id: mockId, userId };
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(mockDeckWithCards);

      await useCase.execute(request);

      expect(mockCardRepository.deleteByIds).toHaveBeenCalledWith(
        mockDeckWithCards.cards.map((card) => card.id)
      );
      expect(mockDeckRepository.deleteByUser).toHaveBeenCalledWith(
        mockId,
        userId
      );
    });

    it("Given a non-existent deck, When execute is called, Then DeckNotFoundError is thrown", async () => {
      const request = { id: "non-existent-id", userId };
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(useCase.execute(request)).rejects.toThrow(DeckNotFoundError);
    });
  });
});
