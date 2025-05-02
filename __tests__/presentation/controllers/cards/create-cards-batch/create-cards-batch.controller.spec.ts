import { describe, expect, it, vi } from "vitest";

import {
  CreateCardsBatchController,
  CreateCardsBatchRequest,
  CreateCardsBatchValidator,
} from "@/presentation/controllers/cards/create-cards-batch";

describe("CreateCardsBatchController", () => {
  it("should be a class", () => {
    expect(CreateCardsBatchController).toBeInstanceOf(Function);
  });

  it("should return created (201) response when use case is successful", async () => {
    const useCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    };

    const validator = new CreateCardsBatchValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as CreateCardsBatchRequest);

    const controller = new CreateCardsBatchController(useCase, validator);

    const validRequest = {
      params: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d1",
      },
      body: {
        cards: [
          {
            question: "What is the capital of France?",
            answer: "Paris",
          },
          {
            question: "What is the capital of Germany?",
            answer: "Berlin",
          },
        ],
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 201,
      body: undefined,
    });
  });

  it("should handle a request with empty cards array", async () => {
    const useCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    };

    const validator = new CreateCardsBatchValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as CreateCardsBatchRequest);

    const controller = new CreateCardsBatchController(useCase, validator);

    const validRequest = {
      params: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d1",
      },
      body: {
        cards: [],
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 201,
      body: undefined,
    });
  });
});
