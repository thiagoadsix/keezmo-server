import { describe, expect, it, vi } from "vitest";

import {
  DeleteDeckController,
  DeleteDeckRequest,
  DeleteDeckValidator,
} from "@/presentation/controllers/decks/delete-deck";

describe("DeleteDeckController", () => {
  it("should be a class", () => {
    expect(DeleteDeckController).toBeInstanceOf(Function);
  });

  it("should return ok response when use case returns a success response", async () => {
    const useCase = {
      execute: vi.fn().mockResolvedValue({}),
    };

    const validator = new DeleteDeckValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as DeleteDeckRequest);

    const controller = new DeleteDeckController(useCase, validator);

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
      statusCode: 204,
      body: undefined,
    });
  });
});
