import { describe, expect, it, vi } from "vitest";

import { StudyModeEnum } from "@/domain/value-objects";

import {
  StartStudySessionController,
  StartStudySessionRequest,
  StartStudySessionValidator,
} from "@/presentation/controllers/study-session/start-study-session";

describe("StartStudySessionController", () => {
  it("should be a class", () => {
    expect(StartStudySessionController).toBeInstanceOf(Function);
  });

  it("should return ok response when use case returns a success response", async () => {
    const sessionId = "3fa1adbb-6beb-4d46-813b-9ece825d39d4";

    const useCase = {
      execute: vi.fn().mockResolvedValue({
        sessionId,
      }),
    };

    const validator = new StartStudySessionValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as StartStudySessionRequest);

    const controller = new StartStudySessionController(useCase, validator);

    const validRequest = {
      body: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d5",
        studyMode: StudyModeEnum.FLASHCARD,
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: {
        sessionId,
      },
    });
  });
});
