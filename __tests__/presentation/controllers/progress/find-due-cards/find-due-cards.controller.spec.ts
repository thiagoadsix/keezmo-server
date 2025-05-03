import { describe, expect, it, vi } from "vitest";

import { Card } from "@/domain/entities/card";
import { DifficultyEnum } from "@/domain/value-objects/difficulty";
import { Progress } from "@/domain/entities/progress";

import {
  FindDueCardsController,
  FindDueCardsRequest,
  FindDueCardsResponse,
} from "@/presentation/controllers/progress/find-due-cards/find-due-cards.controller";
import { FindDueCardsValidator } from "@/presentation/controllers/progress/find-due-cards/find-due-cards.validator";

describe("FindDueCardsController", () => {
  it("should be a class", () => {
    expect(FindDueCardsController).toBeInstanceOf(Function);
  });

  it("should return ok response with due cards when use case returns due cards", async () => {
    const mockCard = {
      id: "card-123",
      deckId: "deck-456",
      question: "What is Clean Architecture?",
      answer: "A software design philosophy that separates concerns",
    } as Card;

    const mockProgress = {
      id: "progress-789",
      cardId: "card-123",
      deckId: "deck-456",
      repetitions: 1,
      interval: 2,
      easeFactor: 2.5,
      difficultyLevel: DifficultyEnum.NORMAL,
      nextReview: "2023-01-15T00:00:00.000Z",
      lastReviewed: "2023-01-10T00:00:00.000Z",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-10T00:00:00.000Z",
      dueDate: new Date("2023-01-15"),
    } as unknown as Progress;

    const mockDueCards: FindDueCardsResponse[] = [
      {
        card: mockCard,
        progress: mockProgress,
      },
    ];

    const useCase = {
      execute: vi.fn().mockResolvedValue(mockDueCards),
    };

    const validator = new FindDueCardsValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data: unknown) => data as FindDueCardsRequest);

    const controller = new FindDueCardsController(useCase, validator);

    const validRequest = {
      params: {
        deckId: "deck-456",
      },
      query: {
        date: "2023-01-15T00:00:00.000Z",
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: mockDueCards,
    });
  });

  it("should return ok response with empty array when no due cards are found", async () => {
    const mockDueCards: FindDueCardsResponse[] = [];

    const useCase = {
      execute: vi.fn().mockResolvedValue(mockDueCards),
    };

    const validator = new FindDueCardsValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data: unknown) => data as FindDueCardsRequest);

    const controller = new FindDueCardsController(useCase, validator);

    const validRequest = {
      params: {
        deckId: "deck-456",
      },
      query: {
        date: "2023-01-15T00:00:00.000Z",
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: [],
    });
  });

  it("should work with optional parameters", async () => {
    const mockCard = {
      id: "card-123",
      deckId: "deck-456",
      question: "What is Clean Architecture?",
      answer: "A software design philosophy that separates concerns",
    } as Card;

    const mockProgress = {
      id: "progress-789",
      cardId: "card-123",
      deckId: "deck-456",
      repetitions: 1,
      interval: 2,
      easeFactor: 2.5,
      difficultyLevel: DifficultyEnum.NORMAL,
      nextReview: "2023-01-15T00:00:00.000Z",
      lastReviewed: "2023-01-10T00:00:00.000Z",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-10T00:00:00.000Z",
      dueDate: new Date("2023-01-15"),
    } as unknown as Progress;

    const mockDueCards: FindDueCardsResponse[] = [
      {
        card: mockCard,
        progress: mockProgress,
      },
    ];

    const useCase = {
      execute: vi.fn().mockResolvedValue(mockDueCards),
    };

    const validator = new FindDueCardsValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data: unknown) => data as FindDueCardsRequest);

    const controller = new FindDueCardsController(useCase, validator);

    const requestWithOnlyDate = {
      params: {},
      query: {
        date: "2023-01-15T00:00:00.000Z",
      },
    };

    const responseWithOnlyDate = await controller.handle(requestWithOnlyDate);

    expect(validatorSpy).toHaveBeenCalledWith(requestWithOnlyDate);
    expect(useCase.execute).toHaveBeenCalledWith(requestWithOnlyDate);
    expect(responseWithOnlyDate).toEqual({
      statusCode: 200,
      body: mockDueCards,
    });

    vi.clearAllMocks();

    const requestWithOnlyDeckId = {
      params: {
        deckId: "deck-456",
      },
      query: {},
    };

    const responseWithOnlyDeckId = await controller.handle(
      requestWithOnlyDeckId
    );

    expect(validatorSpy).toHaveBeenCalledWith(requestWithOnlyDeckId);
    expect(useCase.execute).toHaveBeenCalledWith(requestWithOnlyDeckId);
    expect(responseWithOnlyDeckId).toEqual({
      statusCode: 200,
      body: mockDueCards,
    });
  });
});
