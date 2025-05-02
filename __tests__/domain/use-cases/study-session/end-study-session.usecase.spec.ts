import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EndStudySessionUseCase } from "@/domain/use-cases/study-session/end-study-session.usecase";
import { StudyModeEnum } from "@/domain/value-objects";
import { StudySession } from "@/domain/entities/study-session";
import { StudySessionNotFoundError } from "@/domain/errors/study-session/study-session-not-found-error";

import { mockStudySessionRepository } from "__tests__/@support/mocks/repositories/study-session-repository.mock";

describe("EndStudySessionUseCase", () => {
  let sut: EndStudySessionUseCase;
  let mockSession: StudySession;

  const sessionId = "session-123";
  const userId = "user-123";
  beforeEach(() => {
    const startTime = new Date("2023-05-15T09:50:00Z").toISOString();
    mockSession = new StudySession({
      deckId: "deck-123",
      studyMode: StudyModeEnum.FLASHCARD,
      startTime,
      endTime: startTime,
      userId,
    });

    Object.defineProperty(mockSession, "id", { value: sessionId });

    vi.resetAllMocks();

    mockStudySessionRepository.findById.mockResolvedValue(mockSession);
    mockStudySessionRepository.save.mockResolvedValue(mockSession);

    sut = new EndStudySessionUseCase(mockStudySessionRepository);

    const fixedDate = new Date("2023-05-15T10:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should update the session with the correct end time", async () => {
    const request = {
      sessionId,
    };

    const result = await sut.execute(request);

    expect(mockStudySessionRepository.findById).toHaveBeenCalledWith(sessionId);
    expect(mockStudySessionRepository.save).toHaveBeenCalledTimes(1);

    const updatedSession = vi.mocked(mockStudySessionRepository.save).mock
      .calls[0][0];
    expect(updatedSession.endTime).toBe("2023-05-15T10:00:00.000Z");

    expect(result.durationSeconds).toBe(600);
  });

  it("should throw StudySessionNotFoundError if session does not exist", async () => {
    // Override the mock for this specific test
    mockStudySessionRepository.findById.mockResolvedValue(null);

    const request = {
      sessionId: "non-existent-session",
    };

    await expect(sut.execute(request)).rejects.toThrow(
      StudySessionNotFoundError
    );
    expect(mockStudySessionRepository.save).not.toHaveBeenCalled();
  });

  it("should handle repository errors when saving", async () => {
    const error = new Error("Repository error");
    vi.mocked(mockStudySessionRepository.save).mockRejectedValueOnce(error);

    const request = {
      sessionId,
    };

    await expect(sut.execute(request)).rejects.toThrow("Repository error");
  });
});
