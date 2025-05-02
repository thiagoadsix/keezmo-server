import { describe, expect, it, vi } from "vitest";

import {
  FindDeckByIdAndUserController,
  FindDeckByIdAndUserRequest,
  FindDeckByIdAndUserValidator,
} from "@/presentation/controllers/decks/find-deck-by-id-and-user";

describe("FindDeckByIdAndUserController", () => {
  it("should be a class", () => {
    expect(FindDeckByIdAndUserController).toBeInstanceOf(Function);
  });

  it("should return ok response when use case returns a success response", async () => {
    const mockDeck = {
      id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      title: "Test Deck",
      description: "Test Description",
      userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d1",
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const useCase = {
      execute: vi.fn().mockResolvedValue(mockDeck),
    };

    const validator = new FindDeckByIdAndUserValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as FindDeckByIdAndUserRequest);

    const controller = new FindDeckByIdAndUserController(useCase, validator);

    const validRequest = {
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d1",
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: mockDeck,
    });
  });
});
