import { describe, expect, it, vi } from "vitest";

import { Progress } from "@/domain/entities/progress";

import {
  InitializeProgressController,
  InitializeProgressValidator,
} from "@/presentation/controllers/progress/initialize-progress";

describe("InitializeProgressController", () => {
  it("should be a class", () => {
    expect(InitializeProgressController).toBeInstanceOf(Function);
  });

  it("should return ok response when initializing new progress", async () => {
    // Mock progress
    const mockProgress = {
      id: "progress-id-1",
      cardId: "card-id-1",
      deckId: "deck-id-1",
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      nextReview: new Date().toISOString(),
      lastReviewed: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as unknown as Progress;

    const validRequest = {
      params: {
        cardId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
    };

    const transformedRequest = {
      cardId: validRequest.params.cardId,
      deckId: validRequest.params.deckId,
    };

    const useCase = {
      execute: vi.fn().mockResolvedValue({
        progress: mockProgress,
        isNew: true,
      }),
    };

    const validator = new InitializeProgressValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockReturnValue(transformedRequest);

    const controller = new InitializeProgressController(useCase, validator);

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(transformedRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: {
        progress: mockProgress,
        isNew: true,
      },
    });
  });

  it("should return ok response for existing progress", async () => {
    // Mock progress
    const mockProgress = {
      id: "progress-id-1",
      cardId: "card-id-1",
      deckId: "deck-id-1",
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      nextReview: new Date().toISOString(),
      lastReviewed: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as unknown as Progress;

    const validRequest = {
      params: {
        cardId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
    };

    const transformedRequest = {
      cardId: validRequest.params.cardId,
      deckId: validRequest.params.deckId,
    };

    const useCase = {
      execute: vi.fn().mockResolvedValue({
        progress: mockProgress,
        isNew: false,
      }),
    };

    const validator = new InitializeProgressValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockReturnValue(transformedRequest);

    const controller = new InitializeProgressController(useCase, validator);

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(transformedRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: {
        progress: mockProgress,
        isNew: false,
      },
    });
  });
});
