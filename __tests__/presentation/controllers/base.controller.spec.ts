import { describe, expect, it, vi } from "vitest";

import { BaseController } from "@/presentation/controllers/base.controller";

describe("BaseController", () => {
  it("should return ok response when use case returns a success response", async () => {
    const useCase = {
      execute: vi.fn().mockResolvedValue({
        message: "success",
      }),
    };

    const controller = new BaseController(useCase);

    const response = await controller.handle({});

    expect(response).toEqual({
      statusCode: 200,
      body: { message: "success" },
    });
  });

  it("should return error response when use case throws an error", async () => {
    const useCase = {
      execute: vi.fn().mockRejectedValue(new Error("error")),
    };

    const controller = new BaseController(useCase);

    const response = await controller.handle({});

    expect(response).toEqual({
      statusCode: 500,
      body: { message: "error" },
    });
  });
});
