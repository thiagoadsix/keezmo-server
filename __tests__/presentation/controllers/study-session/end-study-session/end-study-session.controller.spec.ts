import { describe, expect, it, vi } from "vitest";

import {
  EndStudySessionController,
  EndStudySessionRequest,
  EndStudySessionValidator,
} from "@/presentation/controllers/study-session/end-study-session";

describe("EndStudySessionController", () => {
  it("should be a class", () => {
    expect(EndStudySessionController).toBeInstanceOf(Function);
  });

  it("should return ok response when use case returns a success response", async () => {
    const durationSeconds = 180;

    const useCase = {
      execute: vi.fn().mockResolvedValue({
        durationSeconds,
      }),
    };

    const validator = new EndStudySessionValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as EndStudySessionRequest);

    const controller = new EndStudySessionController(useCase, validator);

    const validRequest = {
      params: {
        sessionId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      body: {
        totalQuestions: 10,
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: {
        durationSeconds,
      },
    });
  });

  it("should work with optional totalQuestions", async () => {
    const durationSeconds = 120;

    const useCase = {
      execute: vi.fn().mockResolvedValue({
        durationSeconds,
      }),
    };

    const validator = new EndStudySessionValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as EndStudySessionRequest);

    const controller = new EndStudySessionController(useCase, validator);

    const validRequest = {
      params: {
        sessionId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: {
        durationSeconds,
      },
    });
  });
});
