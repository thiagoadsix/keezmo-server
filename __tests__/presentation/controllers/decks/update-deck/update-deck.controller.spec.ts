import { describe, expect, it, vi } from "vitest";

import {
  UpdateDeckController,
  UpdateDeckRequest,
  UpdateDeckValidator,
} from "@/presentation/controllers/decks/update-deck";

describe("UpdateDeckController", () => {
  it("should be a class", () => {
    expect(UpdateDeckController).toBeInstanceOf(Function);
  });

  it("should return ok response when use case returns a success response", async () => {
    const mockDeck = {
      id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      title: "Updated Deck Title",
      description: "Updated description",
      userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d1",
      studyMode: { value: "spaced" },
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const useCase = {
      execute: vi.fn().mockResolvedValue(mockDeck),
    };

    const validator = new UpdateDeckValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as UpdateDeckRequest);

    const controller = new UpdateDeckController(useCase, validator);

    const validRequest = {
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d1",
      },
      body: {
        title: "Updated Deck Title",
        description: "Updated description",
        studyMode: "spaced",
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

  it("should handle partial updates", async () => {
    const mockDeck = {
      id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      title: "Updated Deck Title Only",
      description: "Original description",
      userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d1",
      studyMode: { value: "standard" },
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const useCase = {
      execute: vi.fn().mockResolvedValue(mockDeck),
    };

    const validator = new UpdateDeckValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as UpdateDeckRequest);

    const controller = new UpdateDeckController(useCase, validator);

    const validRequest = {
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d1",
      },
      body: {
        title: "Updated Deck Title Only",
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
