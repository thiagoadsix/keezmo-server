import { describe, expect, it, vi } from "vitest";

import {
  FindDecksByUserController,
  FindDecksByUserRequest,
  FindDecksByUserValidator,
} from "@/presentation/controllers/decks/find-decks-by-user";

describe("FindDecksByUserController", () => {
  it("should be a class", () => {
    expect(FindDecksByUserController).toBeInstanceOf(Function);
  });

  it("should return ok response when use case returns a success response", async () => {
    const mockDecks = [
      {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        title: "Test Deck 1",
        description: "Test Description 1",
        userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d1",
        cards: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
        title: "Test Deck 2",
        description: "Test Description 2",
        userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d1",
        cards: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const useCase = {
      execute: vi.fn().mockResolvedValue(mockDecks),
    };

    const validator = new FindDecksByUserValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as FindDecksByUserRequest);

    const controller = new FindDecksByUserController(useCase, validator);

    const validRequest = {
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d1",
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: mockDecks,
    });
  });
});
