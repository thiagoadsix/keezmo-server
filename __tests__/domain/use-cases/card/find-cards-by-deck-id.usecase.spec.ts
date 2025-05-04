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

import { Card } from "@/domain/entities/card";
import { Deck } from "@/domain/entities/deck";
import { DeckNotFoundError } from "@/domain/errors/deck/deck-not-found-error";
import { FindCardsByDeckIdUseCase } from "@/domain/use-cases/card/find-cards-by-deck-id.usecase";

describe("FindCardsByDeckIdUseCase", () => {
  let useCase: FindCardsByDeckIdUseCase;
  let mockDeck: Deck;
  let mockDeckWithCards: Deck;
  let mockCards: Card[];

  const mockUserId = "user-123";

  beforeEach(() => {
    useCase = new FindCardsByDeckIdUseCase(
      mockCardRepository,
      mockDeckRepository
    );
    vi.useFakeTimers();
    generateIdMock.mockReturnValue(mockId);

    mockDeck = new Deck(validDeckProps);
    mockDeckWithCards = new Deck(validDeckWithCardsProps);
    mockCards = mockDeckWithCards.cards;

    mockDeckRepository.findByIdAndUserId.mockResolvedValue(mockDeck);
    mockCardRepository.findByDeckId.mockResolvedValue(mockCards);

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  describe("Unit Tests", () => {
    it("should fetch cards from repository when deck exists", async () => {
      const request = { deckId: mockId, userId: mockUserId };

      const result = await useCase.execute(request);

      expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(
        mockId,
        mockUserId
      );
      expect(mockCardRepository.findByDeckId).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockCards);
      expect(result).toHaveLength(mockCards.length);
    });

    it("should throw DeckNotFoundError when deck is not found", async () => {
      const request = { deckId: mockId, userId: mockUserId };
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(useCase.execute(request)).rejects.toThrow(DeckNotFoundError);
      expect(mockCardRepository.findByDeckId).not.toHaveBeenCalled();
    });

    it("should propagate repository errors", async () => {
      const request = { deckId: mockId, userId: mockUserId };
      const repoError = new Error("Repository error");
      mockCardRepository.findByDeckId.mockRejectedValueOnce(repoError);

      await expect(useCase.execute(request)).rejects.toThrow(repoError);
    });
  });

  describe("BDD Scenarios", () => {
    it("Given an existing deck, When execute is called, Then fetch cards from repository", async () => {
      const request = { deckId: mockId, userId: mockUserId };

      const result = await useCase.execute(request);

      expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(
        request.deckId,
        request.userId
      );
      expect(mockCardRepository.findByDeckId).toHaveBeenCalledWith(
        request.deckId
      );
      expect(result).toEqual(mockCards);
    });

    it("Given a non-existent deck, When execute is called, Then throw DeckNotFoundError", async () => {
      const request = { deckId: "non-existent-id", userId: mockUserId };
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(useCase.execute(request)).rejects.toThrow(DeckNotFoundError);
    });

    it("Given a repository error, When execute is called, Then propagate the error", async () => {
      const request = { deckId: mockId, userId: mockUserId };
      const error = new Error("Database connection failed");
      mockCardRepository.findByDeckId.mockRejectedValueOnce(error);

      await expect(useCase.execute(request)).rejects.toThrow(error);
    });
  });
});
