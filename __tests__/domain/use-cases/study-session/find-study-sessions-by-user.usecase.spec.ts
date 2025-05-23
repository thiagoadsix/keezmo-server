import {
  generateIdMock,
  mockId,
} from "__tests__/@support/mocks/shared/utils/generate-id.mock";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockStudySessionRepository } from "__tests__/@support/mocks/repositories/study-session-repository.mock";

import { FindStudySessionsByUserUseCase } from "@/domain/use-cases/study-session/find-study-sessions-by-user.usecase";
import { StudyModeEnum } from "@/domain/value-objects";
import { StudySession } from "@/domain/entities/study-session";

describe("FindStudySessionsByUserUseCase", () => {
  let useCase: FindStudySessionsByUserUseCase;
  let mockStudySessions: StudySession[];
  const userId = "user-123";

  beforeEach(() => {
    useCase = new FindStudySessionsByUserUseCase(mockStudySessionRepository);
    vi.useFakeTimers();
    generateIdMock.mockReturnValue(mockId);

    mockStudySessions = [
      new StudySession({
        deckId: "deck-1",
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        studyMode: StudyModeEnum.MULTIPLE_CHOICE,
        userId,
      }),
      new StudySession({
        deckId: "deck-2",
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        studyMode: StudyModeEnum.FLASHCARD,
        userId,
      }),
    ];

    mockStudySessionRepository.findByUserId.mockResolvedValue(
      mockStudySessions
    );

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  describe("Unit Tests", () => {
    it("should fetch study sessions for the given user ID", async () => {
      const request = {
        userId,
      };

      const result = await useCase.execute(request);

      expect(mockStudySessionRepository.findByUserId).toHaveBeenCalledWith(
        userId
      );
      expect(result).toEqual(mockStudySessions);
      expect(result).toHaveLength(2);
    });

    it("should return an empty array when user has no study sessions", async () => {
      mockStudySessionRepository.findByUserId.mockResolvedValueOnce([]);

      const request = {
        userId,
      };

      const result = await useCase.execute(request);

      expect(mockStudySessionRepository.findByUserId).toHaveBeenCalledWith(
        userId
      );
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should propagate repository errors", async () => {
      const repositoryError = new Error("Database error");
      mockStudySessionRepository.findByUserId.mockRejectedValueOnce(
        repositoryError
      );

      const request = {
        userId,
      };

      await expect(useCase.execute(request)).rejects.toThrow();
      expect(mockStudySessionRepository.findByUserId).toHaveBeenCalledWith(
        userId
      );
    });
  });

  describe("BDD Scenarios", () => {
    it("Given a user ID, When execute is called, Then fetch study sessions from repository", async () => {
      const request = {
        userId,
      };

      const result = await useCase.execute(request);

      expect(mockStudySessionRepository.findByUserId).toHaveBeenCalledWith(
        userId
      );
      expect(result).toEqual(mockStudySessions);
      expect(result).toHaveLength(2);
    });

    it("Given a user with no study sessions, When execute is called, Then return empty array", async () => {
      mockStudySessionRepository.findByUserId.mockResolvedValueOnce([]);
      const request = {
        userId,
      };

      const result = await useCase.execute(request);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("Given a repository error, When execute is called, Then propagate the error", async () => {
      const repositoryError = new Error("Database error");
      mockStudySessionRepository.findByUserId.mockRejectedValueOnce(
        repositoryError
      );
      const request = {
        userId,
      };

      await expect(useCase.execute(request)).rejects.toThrow();
      expect(mockStudySessionRepository.findByUserId).toHaveBeenCalledWith(
        userId
      );
    });
  });
});
