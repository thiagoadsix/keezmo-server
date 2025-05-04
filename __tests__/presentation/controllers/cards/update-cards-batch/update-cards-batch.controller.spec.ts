import { describe, expect, it, vi } from "vitest";

import {
  UpdateCardsBatchController,
  UpdateCardsBatchRequest,
} from "@/presentation/controllers/cards/update-cards-batch";
import { UpdateCardsBatchValidator } from "@/presentation/controllers/cards/update-cards-batch/update-cards-batch.validator";

describe("UpdateCardsBatchController", () => {
  it("should be a class", () => {
    expect(UpdateCardsBatchController).toBeInstanceOf(Function);
  });

  it("should return ok response when use case returns a success response", async () => {
    const mockCards = [
      {
        id: "card-1",
        question: "Updated Question 1",
        answer: "Updated Answer 1",
      },
      {
        id: "card-2",
        question: "Updated Question 2",
        answer: "Updated Answer 2",
      },
    ];

    const useCase = {
      execute: vi.fn().mockResolvedValue(mockCards),
    };

    const validator = new UpdateCardsBatchValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data: unknown) => data as UpdateCardsBatchRequest);

    const controller = new UpdateCardsBatchController(useCase, validator);

    const validRequest = {
      user: {
        id: "user-123",
      },
      params: {
        deckId: "deck-123",
      },
      body: [
        {
          id: "card-1",
          question: "Updated Question 1",
        },
        {
          id: "card-2",
          answer: "Updated Answer 2",
        },
      ],
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: mockCards,
    });
  });
});
