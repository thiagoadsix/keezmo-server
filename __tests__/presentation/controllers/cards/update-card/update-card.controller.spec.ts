import { describe, expect, it, vi } from "vitest";

import {
  UpdateCardController,
  UpdateCardRequest,
  UpdateCardValidator,
} from "@/presentation/controllers/cards/update-card";

describe("UpdateCardController", () => {
  it("should be a class", () => {
    expect(UpdateCardController).toBeInstanceOf(Function);
  });

  it("should return ok response with updated card when use case is successful", async () => {
    const mockUpdatedCard = {
      id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      question: "Updated question?",
      answer: "Paris",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const useCase = {
      execute: vi.fn().mockResolvedValue(mockUpdatedCard),
    };

    const validator = new UpdateCardValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as UpdateCardRequest);

    const controller = new UpdateCardController(useCase, validator);

    const validRequest = {
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      body: {
        question: "Updated question?",
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: mockUpdatedCard,
    });
  });

  it("should handle updating both question and answer fields", async () => {
    const mockUpdatedCard = {
      id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      question: "Updated question?",
      answer: "Updated answer",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const useCase = {
      execute: vi.fn().mockResolvedValue(mockUpdatedCard),
    };

    const validator = new UpdateCardValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as UpdateCardRequest);

    const controller = new UpdateCardController(useCase, validator);

    const validRequest = {
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      body: {
        question: "Updated question?",
        answer: "Updated answer",
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: mockUpdatedCard,
    });
  });
});
