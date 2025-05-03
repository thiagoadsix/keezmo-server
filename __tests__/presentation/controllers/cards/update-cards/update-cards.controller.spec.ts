import { describe, expect, it, vi } from "vitest";

import {
  UpdateCardsController,
  UpdateCardsRequest,
} from "@/presentation/controllers/cards/update-cards/update-cards.controller";
import { UpdateCardsValidator } from "@/presentation/controllers/cards/update-cards/update-cards.validator";

describe("UpdateCardsController", () => {
  it("should be a class", () => {
    expect(UpdateCardsController).toBeInstanceOf(Function);
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

    const validator = new UpdateCardsValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data: unknown) => data as UpdateCardsRequest);

    const controller = new UpdateCardsController(useCase, validator);

    const validRequest = {
      body: {
        deckId: "deck-123",
        cards: [
          {
            id: "card-1",
            question: "Updated Question 1",
          },
          {
            id: "card-2",
            answer: "Updated Answer 2",
          },
        ],
      },
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
