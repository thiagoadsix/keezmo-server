import { describe, expect, it, vi } from "vitest";

import { StudyModeEnum } from "@/domain/value-objects";

import {
  CreateDeckController,
  CreateDeckRequest,
  CreateDeckValidator,
} from "@/presentation/controllers/decks/create-deck";

describe("CreateDeckController", () => {
  it("should be a class", () => {
    expect(CreateDeckController).toBeInstanceOf(Function);
  });

  it("should return ok response when use case returns a success response", async () => {
    const useCase = {
      execute: vi.fn().mockResolvedValue({}),
    };

    const validator = new CreateDeckValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as CreateDeckRequest);

    const controller = new CreateDeckController(useCase, validator);

    const validRequest = {
      body: {
        userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        title: "Sample Deck",
        description: "A sample deck for testing",
        studyMode: StudyModeEnum.FLASHCARD,
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: {},
    });
  });
});
