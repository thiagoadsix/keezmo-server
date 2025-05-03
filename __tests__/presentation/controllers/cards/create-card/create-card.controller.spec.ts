import { describe, expect, it, vi } from "vitest";

import {
  CreateCardController,
  CreateCardRequest,
  CreateCardValidator,
} from "@/presentation/controllers/cards/create-card";

describe("CreateCardController", () => {
  it("should be a class", () => {
    expect(CreateCardController).toBeInstanceOf(Function);
  });

  it("should return ok response when use case returns a success response", async () => {
    const mockCard = {
      id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      question: "What is the capital of France?",
      answer: "Paris",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockProgress = {
      id: "5fa1adbb-6beb-4d46-813b-9ece825d39d6",
      cardId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      repetitions: 0,
      easeFactor: 2.5,
      interval: 0,
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockResponse = {
      card: mockCard,
      progress: mockProgress,
    };

    const useCase = {
      execute: vi.fn().mockResolvedValue(mockResponse),
    };

    const validator = new CreateCardValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as CreateCardRequest);

    const controller = new CreateCardController(useCase, validator);

    const validRequest = {
      params: {
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d1",
      },
      body: {
        question: "What is the capital of France?",
        answer: "Paris",
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: mockResponse,
    });
  });
});
