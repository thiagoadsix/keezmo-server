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

import { Deck } from "@/domain/entities/deck";
import { DeckNotFoundError } from "@/domain/errors/deck/deck-not-found-error";
import { FindDeckByIdAndUserUseCase } from "@/domain/use-cases/deck/find-deck-by-id-and-user.usecase";

describe("FindDeckByIdAndUserUseCase", () => {
  let useCase: FindDeckByIdAndUserUseCase;
  let mockDeck: Deck;
  let mockDeckWithCards: Deck;
  const userId = "user-123";

  beforeEach(() => {
    useCase = new FindDeckByIdAndUserUseCase(mockDeckRepository, mockCardRepository);
    vi.useFakeTimers();
    generateIdMock.mockReturnValue(mockId);

    mockDeck = new Deck(validDeckProps);
    mockDeckWithCards = new Deck({
      ...validDeckWithCardsProps,
      cards: [...validDeckWithCardsProps.cards]
    });

    mockDeckRepository.findByIdAndUserId.mockResolvedValue(mockDeck);
    mockCardRepository.findByDeckId.mockResolvedValue(mockDeckWithCards.cards);

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  describe("Unit Tests", () => {
    it("should return the deck when deckId and userId match", async () => {
      const request = { id: mockId, userId };

      const result = await useCase.execute(request);

      expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(
        mockId,
        userId
      );
      expect(result).toEqual(mockDeck);
    });

    it("should throw DeckNotFoundError when deck is not found", async () => {
      const request = { id: mockId, userId };
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(null);

      const promise = useCase.execute(request);
      await expect(promise).rejects.toThrow(DeckNotFoundError);

      const promise2 = useCase.execute(request);
      await expect(promise2).rejects.toThrow(
        `Deck with ID ${mockId} not found for user ${userId}`
      );

      expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(
        mockId,
        userId
      );
      expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledTimes(2);
    });

    it("should propagate repository errors", async () => {
      const request = { id: mockId, userId };
      const repoError = new Error("Repository error");
      mockDeckRepository.findByIdAndUserId.mockRejectedValueOnce(repoError);

      await expect(useCase.execute(request)).rejects.toThrow(repoError);
    });

    it("should return deck with cards when cards are present", async () => {
      const request = { id: mockId, userId };
      const deckForTest = new Deck({
        ...validDeckWithCardsProps,
        cards: []
      });

      mockDeckRepository.findByIdAndUserId.mockResolvedValueOnce(deckForTest);
      mockCardRepository.findByDeckId.mockResolvedValueOnce(validDeckWithCardsProps.cards);

      const result = await useCase.execute(request);

      expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(
        mockId,
        userId
      );
      expect(result.cards.length).toBe(2);
    });
  });

  describe("BDD Scenarios", () => {
    it("Given valid deckId and userId, When execute is called, Then the deck is returned", async () => {
      const request = { id: mockId, userId };

      const result = await useCase.execute(request);

      expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(
        request.id,
        request.userId
      );
      expect(result).toEqual(mockDeck);
    });

    it("Given non-existent deck, When execute is called, Then DeckNotFoundError is thrown", async () => {
      const request = { id: "non-existent-id", userId };
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(useCase.execute(request)).rejects.toThrow(DeckNotFoundError);
      expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(
        request.id,
        request.userId
      );
    });

    it("Given non-existent deck, When execute is called, Then error message is specific", async () => {
      const request = { id: "non-existent-id", userId };
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(useCase.execute(request)).rejects.toThrow(
        `Deck with ID ${request.id} not found for user ${userId}`
      );
    });

    it("Given a deck with cards, When execute is called, Then the deck with cards is returned", async () => {
      const request = { id: mockId, userId };
      const deckForTest = new Deck({
        ...validDeckWithCardsProps,
        cards: []
      });

      mockDeckRepository.findByIdAndUserId.mockResolvedValueOnce(deckForTest);
      mockCardRepository.findByDeckId.mockResolvedValueOnce(validDeckWithCardsProps.cards);

      const result = await useCase.execute(request);

      expect(result).not.toBeNull();
      expect(result.cards).toHaveLength(2);
      expect(result.cards[0].question).toBe("What is the capital of France?");
      expect(result.cards[1].question).toBe("What is the capital of Germany?");
    });
  });
});
