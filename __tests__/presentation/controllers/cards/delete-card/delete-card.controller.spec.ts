import { describe, expect, it, vi } from "vitest";

import {
  DeleteCardController,
  DeleteCardRequest,
  DeleteCardValidator,
} from "@/presentation/controllers/cards/delete-card";

describe("DeleteCardController", () => {
  it("should be a class", () => {
    expect(DeleteCardController).toBeInstanceOf(Function);
  });

  it("should return no content (204) response when use case is successful", async () => {
    const useCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    };

    const validator = new DeleteCardValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as DeleteCardRequest);

    const controller = new DeleteCardController(useCase, validator);

    const validRequest = {
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      user: {
        id: "5fa1adbb-6beb-4d46-813b-9ece825d39d6",
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 204,
      body: undefined,
    });
  });
});
