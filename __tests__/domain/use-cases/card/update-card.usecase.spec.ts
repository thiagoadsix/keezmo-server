import {
  generateIdMock,
  mockId,
} from "__tests__/@support/mocks/shared/utils/generate-id.mock";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockCardRepository } from "__tests__/@support/mocks/repositories/card-repository.mock";
import { mockDeckRepository } from "__tests__/@support/mocks/repositories/deck-repository.mock";
import { validDeckProps } from "__tests__/@support/fixtures/deck.fixtures";

import { Card } from "@/domain/entities/card";
import { CardNotFoundError } from "@/domain/errors/card/card-not-found-error";
import { Deck } from "@/domain/entities/deck";
import { DeckNotFoundError } from "@/domain/errors/deck/deck-not-found-error";
import { UpdateCardUseCase } from "@/domain/use-cases/card/update-card.usecase";

describe("UpdateCardUseCase", () => {
  let useCase: UpdateCardUseCase;
  let mockDeck: Deck;
  let mockCard: Card;
  const deckId = mockId;
  const cardId = "card-1";

  beforeEach(() => {
    vi.useFakeTimers();
    generateIdMock.mockReturnValue(mockId);

    useCase = new UpdateCardUseCase(mockCardRepository, mockDeckRepository);
    mockDeck = new Deck(validDeckProps);

    mockCard = Object.assign(
      new Card({
        deckId: mockId,
        question: "What is the capital of France?",
        answer: "Paris",
      }),
      { id: cardId }
    );

    mockDeckRepository.findById.mockResolvedValue(mockDeck);
    mockCardRepository.findByIdAndDeckId.mockResolvedValue(mockCard);
    mockCardRepository.save.mockResolvedValue(undefined);

    vi.clearAllMocks();

    vi.spyOn(mockCard, "updateQuestion");
    vi.spyOn(mockCard, "updateAnswer");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  describe("Unit Tests", () => {
    it("should update card question when it exists in the deck", async () => {
      const request = {
        deckId,
        id: cardId,
        data: {
          question: "Updated question",
        },
      };

      const result = await useCase.execute(request);

      expect(mockDeckRepository.findById).toHaveBeenCalledWith(deckId);
      expect(mockCardRepository.findByIdAndDeckId).toHaveBeenCalledWith(
        cardId,
        deckId
      );
      expect(mockCard.updateQuestion).toHaveBeenCalledWith("Updated question");
      expect(mockCard.updateAnswer).not.toHaveBeenCalled();
      expect(mockCardRepository.save).toHaveBeenCalledWith(mockCard);
      expect(result).toBe(mockCard);
    });

    it("should update card answer when it exists in the deck", async () => {
      const request = {
        deckId,
        id: cardId,
        data: {
          answer: "Updated answer",
        },
      };

      const result = await useCase.execute(request);

      expect(mockCard.updateQuestion).not.toHaveBeenCalled();
      expect(mockCard.updateAnswer).toHaveBeenCalledWith("Updated answer");
      expect(mockCardRepository.save).toHaveBeenCalledWith(mockCard);
      expect(result).toBe(mockCard);
    });

    it("should update multiple fields when provided together", async () => {
      const request = {
        deckId,
        id: cardId,
        data: {
          question: "New question",
          answer: "New answer",
        },
      };

      await useCase.execute(request);

      expect(mockCard.updateQuestion).toHaveBeenCalledWith("New question");
      expect(mockCard.updateAnswer).toHaveBeenCalledWith("New answer");
      expect(mockCardRepository.save).toHaveBeenCalledWith(mockCard);
    });

    it("should throw DeckNotFoundError when deck is not found", async () => {
      mockDeckRepository.findById.mockResolvedValueOnce(null);

      const request = {
        deckId,
        id: cardId,
        data: {
          question: "Updated question",
        },
      };

      await expect(useCase.execute(request)).rejects.toThrow(DeckNotFoundError);
      expect(mockCardRepository.findByIdAndDeckId).not.toHaveBeenCalled();
      expect(mockCardRepository.save).not.toHaveBeenCalled();
    });

    it("should throw CardNotFoundError when card is not found", async () => {
      mockCardRepository.findByIdAndDeckId.mockResolvedValueOnce(null);

      const request = {
        deckId,
        id: cardId,
        data: {
          question: "Updated question",
        },
      };

      await expect(useCase.execute(request)).rejects.toThrow(CardNotFoundError);
      expect(mockCardRepository.save).not.toHaveBeenCalled();
    });

    it("should throw CardNotFoundError when card belongs to different deck", async () => {
      const differentDeckCard = Object.assign(
        new Card({
          deckId: "different-deck-id",
          question: "Question",
          answer: "Answer",
        }),
        { id: cardId }
      );

      mockCardRepository.findByIdAndDeckId.mockResolvedValueOnce(
        differentDeckCard
      );

      const request = {
        deckId,
        id: cardId,
        data: {
          question: "Updated question",
        },
      };

      await expect(useCase.execute(request)).rejects.toThrow(CardNotFoundError);
      expect(mockCardRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("BDD Scenarios", () => {
    it("Given a valid card in a deck, When execute is called with card updates, Then the card is updated", async () => {
      const request = {
        deckId,
        id: cardId,
        data: {
          question: "New question",
          answer: "New answer",
        },
      };

      const result = await useCase.execute(request);

      expect(mockCard.updateQuestion).toHaveBeenCalledWith("New question");
      expect(mockCard.updateAnswer).toHaveBeenCalledWith("New answer");
      expect(mockCardRepository.save).toHaveBeenCalledWith(mockCard);
      expect(result).toBe(mockCard);
    });

    it("Given a non-existent deck, When execute is called, Then DeckNotFoundError is thrown", async () => {
      mockDeckRepository.findById.mockResolvedValueOnce(null);

      const request = {
        deckId: "non-existent-deck-id",
        id: cardId,
        data: {
          question: "Updated",
        },
      };

      await expect(useCase.execute(request)).rejects.toThrow(DeckNotFoundError);
    });

    it("Given a non-existent card, When execute is called, Then CardNotFoundError is thrown", async () => {
      mockCardRepository.findByIdAndDeckId.mockResolvedValueOnce(null);

      const request = {
        deckId,
        id: "non-existent-card-id",
        data: {
          question: "Updated",
        },
      };

      await expect(useCase.execute(request)).rejects.toThrow(CardNotFoundError);
    });

    it("Given a card from different deck, When execute is called, Then CardNotFoundError is thrown with deck mismatch", async () => {
      const differentDeckCard = Object.assign(
        new Card({
          deckId: "different-deck-id",
          question: "Question",
          answer: "Answer",
        }),
        { id: cardId }
      );

      mockCardRepository.findByIdAndDeckId.mockResolvedValueOnce(
        differentDeckCard
      );

      const request = {
        deckId,
        id: cardId,
        data: {
          question: "Updated",
        },
      };

      await expect(useCase.execute(request)).rejects.toThrow(CardNotFoundError);
    });
  });
});
