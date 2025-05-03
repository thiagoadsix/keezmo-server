import {
  generateIdMock,
  mockId,
} from "__tests__/@support/mocks/shared/utils/generate-id.mock";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  validDeckProps,
  validDeckWithCardsProps,
} from "__tests__/@support/fixtures/deck.fixtures";
import { mockDeckRepository } from "__tests__/@support/mocks/repositories/deck-repository.mock";

import { Deck } from "@/domain/entities/deck";
import { FindDecksByUserUseCase } from "@/domain/use-cases/deck/find-decks-by-user.usecase";

describe("FindDecksByUserUseCase", () => {
  let useCase: FindDecksByUserUseCase;
  let mockDecks: Deck[];
  const userId = "user-123";

  beforeEach(() => {
    useCase = new FindDecksByUserUseCase(mockDeckRepository);
    vi.useFakeTimers();
    generateIdMock.mockReturnValue(mockId);

    const deck1 = new Deck(validDeckProps);
    const deck2 = new Deck(validDeckWithCardsProps);

    mockDecks = [deck1, deck2];
    mockDeckRepository.findAllByUser.mockResolvedValue(mockDecks);

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  describe("Unit Tests", () => {
    it("should return all decks for the given user ID", async () => {
      const request = { userId };

      const result = await useCase.execute(request);

      expect(mockDeckRepository.findAllByUser).toHaveBeenCalledWith(userId);
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockDecks);
    });

    it("should propagate repository errors", async () => {
      const request = { userId };
      const repoError = new Error("Repository error");
      mockDeckRepository.findAllByUser.mockRejectedValueOnce(repoError);

      await expect(useCase.execute(request)).rejects.toThrow(repoError);
    });
  });

  describe("BDD Scenarios", () => {
    it("Given a user ID, When execute is called, Then all decks for that user are returned", async () => {
      const request = { userId: "user-123" };

      const result = await useCase.execute(request);

      expect(mockDeckRepository.findAllByUser).toHaveBeenCalledWith(
        request.userId
      );
      expect(result).toEqual(mockDecks);
    });

    it("Given a repository error, When execute is called, Then the error is propagated", async () => {
      const request = { userId: "user-123" };
      const repoError = new Error("Database connection failed");
      mockDeckRepository.findAllByUser.mockRejectedValueOnce(repoError);

      await expect(useCase.execute(request)).rejects.toThrow(repoError);
    });
  });
});
