import { describe, expect, it, vi } from "vitest";

import {
  FindCardsByDeckIdController,
  FindCardsByDeckIdRequest,
  FindCardsByDeckIdValidator,
} from "@/presentation/controllers/cards/find-cards-by-deck-id";

describe("FindCardsByDeckIdController", () => {
  it("should be a class", () => {
    expect(FindCardsByDeckIdController).toBeInstanceOf(Function);
  });

  it("should return ok response with cards when use case is successful", async () => {
    const mockCards = [
      {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
        question: "What is the capital of France?",
        answer: "Paris",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5fa1adbb-6beb-4d46-813b-9ece825d39d6",
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
        question: "What is the capital of Germany?",
        answer: "Berlin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const useCase = {
      execute: vi.fn().mockResolvedValue(mockCards),
    };

    const validator = new FindCardsByDeckIdValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as FindCardsByDeckIdRequest);

    const controller = new FindCardsByDeckIdController(useCase, validator);

    const validRequest = {
      params: {
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
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

  it("should return ok with empty array when no cards are found", async () => {
    const useCase = {
      execute: vi.fn().mockResolvedValue([]),
    };

    const validator = new FindCardsByDeckIdValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as FindCardsByDeckIdRequest);

    const controller = new FindCardsByDeckIdController(useCase, validator);

    const validRequest = {
      params: {
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
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
});
