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
import { UpdateCardsBatchUseCase } from "@/domain/use-cases/card/update-cards-batch.usecase";

describe("UpdateCardsBatchUseCase", () => {
  let useCase: UpdateCardsBatchUseCase;
  let mockDeck: Deck;
  let mockCards: Card[];
  const deckId = mockId;
  const card1Id = "card-1";
  const card2Id = "card-2";
  const userId = "user-123";
  beforeEach(() => {
    vi.useFakeTimers();
    generateIdMock.mockReturnValue(mockId);

    useCase = new UpdateCardsBatchUseCase(
      mockCardRepository,
      mockDeckRepository
    );
    mockDeck = new Deck(validDeckProps);

    mockCards = [
      Object.assign(
        new Card({
          deckId: mockId,
          question: "What is the capital of France?",
          answer: "Paris",
        }),
        { id: card1Id }
      ),
      Object.assign(
        new Card({
          deckId: mockId,
          question: "What is the capital of Germany?",
          answer: "Berlin",
        }),
        { id: card2Id }
      ),
    ];

    mockDeckRepository.findByIdAndUserId.mockResolvedValue(mockDeck);
    mockCardRepository.findByDeckId.mockResolvedValue(mockCards);
    mockCardRepository.save.mockResolvedValue(undefined);

    vi.clearAllMocks();

    mockCards.forEach((card) => {
      vi.spyOn(card, "updateQuestion");
      vi.spyOn(card, "updateAnswer");
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  describe("Unit Tests", () => {
    it("should update cards when they exist in the deck", async () => {
      const card1 = mockCards[0];
      const card2 = mockCards[1];

      const request = {
        deckId,
        userId,
        cards: [
          {
            id: card1.id,
            question: "Updated question 1",
            answer: "Updated answer 1",
          },
          {
            id: card2.id,
            question: "Updated question 2",
          },
        ],
      };

      const result = await useCase.execute(request);

      expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(
        deckId,
        userId
      );
      expect(mockCardRepository.findByDeckId).toHaveBeenCalledWith(deckId);

      expect(card1.updateQuestion).toHaveBeenCalledWith("Updated question 1");
      expect(card1.updateAnswer).toHaveBeenCalledWith("Updated answer 1");
      expect(mockCardRepository.save).toHaveBeenCalledWith(card1);

      expect(card2.updateQuestion).toHaveBeenCalledWith("Updated question 2");
      expect(card2.updateAnswer).not.toHaveBeenCalled();
      expect(mockCardRepository.save).toHaveBeenCalledWith(card2);

      expect(result).toHaveLength(2);
      expect(result).toContain(card1);
      expect(result).toContain(card2);
    });

    it("should throw DeckNotFoundError when deck is not found", async () => {
      mockDeckRepository.findByIdAndUserId.mockResolvedValueOnce(null);

      const request = {
        deckId,
        userId,
        cards: [{ id: mockCards[0].id, question: "Updated" }],
      };

      await expect(useCase.execute(request)).rejects.toThrow(DeckNotFoundError);
      expect(mockCardRepository.findByDeckId).not.toHaveBeenCalled();
      expect(mockCardRepository.save).not.toHaveBeenCalled();
    });

    it("should throw CardNotFoundError when a card is not found in the deck", async () => {
      const request = {
        deckId,
        userId,
        cards: [{ id: "non-existent-card-id", question: "Updated" }],
      };

      await expect(useCase.execute(request)).rejects.toThrow(CardNotFoundError);
      expect(mockCardRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("BDD Scenarios", () => {
    it("Given existing cards in a deck, When execute is called with updates, Then the cards are updated", async () => {
      const card1 = mockCards[0];
      const card2 = mockCards[1];

      const request = {
        deckId,
        userId,
        cards: [
          {
            id: card1.id,
            question: "New question 1",
            answer: "New answer 1",
          },
          {
            id: card2.id,
            answer: "New answer 2",
          },
        ],
      };

      const result = await useCase.execute(request);

      expect(card1.updateQuestion).toHaveBeenCalledWith("New question 1");
      expect(card1.updateAnswer).toHaveBeenCalledWith("New answer 1");
      expect(card2.updateQuestion).not.toHaveBeenCalled();
      expect(card2.updateAnswer).toHaveBeenCalledWith("New answer 2");
      expect(result).toHaveLength(2);
      expect(mockCardRepository.save).toHaveBeenCalledTimes(2);
    });

    it("Given a non-existent deck, When execute is called, Then DeckNotFoundError is thrown", async () => {
      mockDeckRepository.findByIdAndUserId.mockResolvedValueOnce(null);

      const request = {
        deckId: "non-existent-deck-id",
        userId,
        cards: [{ id: mockCards[0].id, question: "Updated" }],
      };

      await expect(useCase.execute(request)).rejects.toThrow(DeckNotFoundError);
    });

    it("Given a non-existent card, When execute is called, Then CardNotFoundError is thrown", async () => {
      const request = {
        deckId,
        userId,
        cards: [{ id: "non-existent-card-id", question: "Updated" }],
      };

      await expect(useCase.execute(request)).rejects.toThrow(CardNotFoundError);
    });
  });
});
