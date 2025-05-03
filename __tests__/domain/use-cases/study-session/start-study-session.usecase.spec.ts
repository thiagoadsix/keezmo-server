import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { StartStudySessionUseCase } from "@/domain/use-cases/study-session/start-study-session.usecase";
import { StudyModeEnum } from "@/domain/value-objects";
import { StudySession } from "@/domain/entities/study-session";
import { StudySessionValidationError } from "@/domain/errors/study-session/study-session-validation-error";

import { mockStudySessionRepository } from "__tests__/@support/mocks/repositories/study-session-repository.mock";

describe("StartStudySessionUseCase", () => {
  let sut: StartStudySessionUseCase;

  beforeEach(() => {
    vi.resetAllMocks();

    sut = new StartStudySessionUseCase(mockStudySessionRepository);

    const fixedDate = new Date("2023-05-15T10:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should create a flashcard study session with correct start time", async () => {
    const request = {
      deckId: "deck-123",
      userId: "user-123",
      studyMode: StudyModeEnum.FLASHCARD,
    };

    const result = await sut.execute(request);

    expect(mockStudySessionRepository.save).toHaveBeenCalledTimes(1);

    const savedSession = vi.mocked(mockStudySessionRepository.save).mock
      .calls[0][0];
    expect(savedSession).toBeInstanceOf(StudySession);
    expect(savedSession.deckId).toBe(request.deckId);
    expect(savedSession.studyMode).toBe(StudyModeEnum.FLASHCARD);
    expect(savedSession.startTime).toBe("2023-05-15T10:00:00.000Z");

    expect(result.sessionId).toBe(savedSession.id);
  });

  it("should throw an error if repository fails", async () => {
    const request = {
      deckId: "deck-123",
      userId: "user-123",
      studyMode: StudyModeEnum.FLASHCARD,
    };

    const error = new Error("Repository error");
    vi.mocked(mockStudySessionRepository.save).mockRejectedValueOnce(error);

    await expect(sut.execute(request)).rejects.toThrow("Repository error");
  });

  it("should throw StudySessionValidationError if deckId is empty", async () => {
    const request = {
      deckId: "",
      studyMode: StudyModeEnum.FLASHCARD,
      userId: "user-123",
    };

    await expect(sut.execute(request)).rejects.toThrow(
      StudySessionValidationError
    );
    expect(mockStudySessionRepository.save).not.toHaveBeenCalled();
  });
});
