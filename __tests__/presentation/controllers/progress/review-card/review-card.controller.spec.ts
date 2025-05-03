import { describe, expect, it, vi } from "vitest";

import { DifficultyEnum } from "@/domain/value-objects";
import { Progress } from "@/domain/entities/progress";

import {
  ReviewCardController,
  ReviewCardRequest,
  ReviewCardValidator,
} from "@/presentation/controllers/progress/review-card";

describe("ReviewCardController", () => {
  it("should be a class", () => {
    expect(ReviewCardController).toBeInstanceOf(Function);
  });

  it("should return ok response when use case returns a success response", async () => {
    // Mock data
    const nextReview = new Date();
    const mockProgress = {
      id: "progress-id",
      cardId: "card-id",
      deckId: "deck-id",
      easeFactor: 2.5,
      interval: 1,
      repetitions: 1,
      nextReview: nextReview.toISOString(),
      lastReviewed: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      applyScheduling: vi.fn(),
    } as unknown as Progress;

    const useCase = {
      execute: vi.fn().mockResolvedValue({
        progress: mockProgress,
        nextReview,
      }),
    };

    const validator = new ReviewCardValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as ReviewCardRequest);

    const controller = new ReviewCardController(useCase, validator);

    const validRequest = {
      params: {
        cardId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      body: {
        difficulty: DifficultyEnum.HARD,
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: {
        progress: mockProgress,
        nextReview,
      },
    });
  });
});
