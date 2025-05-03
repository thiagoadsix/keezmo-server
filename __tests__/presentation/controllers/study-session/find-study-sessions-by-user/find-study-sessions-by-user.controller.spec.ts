import { describe, expect, it, vi } from "vitest";

import { StudySession } from "@/domain/entities/study-session";

import {
  FindStudySessionsByUserController,
  FindStudySessionsByUserRequest,
  FindStudySessionsByUserValidator,
} from "@/presentation/controllers/study-session/find-study-sessions-by-user";

describe("FindStudySessionsByUserController", () => {
  it("should be a class", () => {
    expect(FindStudySessionsByUserController).toBeInstanceOf(Function);
  });

  it("should return ok response when use case returns a success response", async () => {
    // Mock study sessions
    const studySessions = [
      {
        id: "session-id-1",
        deckId: "deck-id-1",
        userId: "user-id-1",
        startTime: "2023-01-01T10:00:00Z",
        endTime: "2023-01-01T10:30:00Z",
        studyMode: "FLASHCARD",
      },
      {
        id: "session-id-2",
        deckId: "deck-id-2",
        userId: "user-id-1",
        startTime: "2023-01-02T14:00:00Z",
        endTime: "2023-01-02T14:45:00Z",
        studyMode: "QUIZ",
      },
    ] as unknown as StudySession[];

    const useCase = {
      execute: vi.fn().mockResolvedValue(studySessions),
    };

    const validator = new FindStudySessionsByUserValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as FindStudySessionsByUserRequest);

    const controller = new FindStudySessionsByUserController(
      useCase,
      validator
    );

    const validRequest = {
      params: {
        userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: studySessions,
    });
  });

  it("should return empty array when no study sessions found", async () => {
    const studySessions: StudySession[] = [];

    const useCase = {
      execute: vi.fn().mockResolvedValue(studySessions),
    };

    const validator = new FindStudySessionsByUserValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as FindStudySessionsByUserRequest);

    const controller = new FindStudySessionsByUserController(
      useCase,
      validator
    );

    const validRequest = {
      params: {
        userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
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
