import {
  generateIdMock,
  mockId,
} from "__tests__/@support/mocks/shared/utils/generate-id.mock";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockCardRepository } from "__tests__/@support/mocks/repositories/card-repository.mock";
import { mockDeckRepository } from "__tests__/@support/mocks/repositories/deck-repository.mock";
import { mockStudySessionRepository } from "__tests__/@support/mocks/repositories/study-session-repository.mock";
import { validCardProps } from "__tests__/@support/fixtures/card.fixtures";

import { StudyMode, StudyModeEnum } from "@/domain/value-objects";
import { Card } from "@/domain/entities/card";
import { Deck } from "@/domain/entities/deck";
import { FindStudySessionsByUserUseCase } from "@/domain/use-cases/study-session/find-study-sessions-by-user.usecase";
import { StudySession } from "@/domain/entities/study-session";

describe("FindStudySessionsByUserUseCase", () => {
  let useCase: FindStudySessionsByUserUseCase;
  let mockStudySessions: StudySession[];
  let mockDeck1: Deck;
  let mockDeck2: Deck;
  let mockCards: Card[]
  const userId = "user-123";

  beforeEach(() => {
    useCase = new FindStudySessionsByUserUseCase(mockStudySessionRepository, mockDeckRepository, mockCardRepository);
    vi.useFakeTimers();
    generateIdMock.mockReturnValue(mockId);

    mockDeck1 = new Deck({
      id: "deck-1",
      userId,
      title: "Deck 1",
      description: "Deck 1 description",
      studyMode: new StudyMode(StudyModeEnum.FLASHCARD),
    });

    mockDeck2 = new Deck({
      id: "deck-2",
      userId,
      title: "Deck 2",
      description: "Deck 2 description",
      studyMode: new StudyMode(StudyModeEnum.FLASHCARD),
    });

    mockCards = [new Card({...validCardProps, deckId: mockDeck1.id})]

    mockStudySessions = [
      new StudySession({
        deckId: "deck-1",
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        studyMode: StudyModeEnum.MULTIPLE_CHOICE,
        userId,
        deck: mockDeck1,
      }),
      new StudySession({
        deckId: "deck-2",
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        studyMode: StudyModeEnum.FLASHCARD,
        userId,
        deck: mockDeck2,
      }),
    ];

    mockStudySessionRepository.findByUserId.mockResolvedValue(
      mockStudySessions
    );
    mockDeckRepository.findAllByUser.mockResolvedValue([mockDeck1, mockDeck2]);
    mockCardRepository.findByDeckIds.mockResolvedValue([mockCards])

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
      console.log({request})

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

    it("should fetch study sessions with decks", async () => {
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

    it("Given a user with study sessions and decks, When execute is called, Then return study sessions with decks", async () => {
      const request = {
        userId,
      };

      const result = await useCase.execute(request);

      expect(result).toEqual(mockStudySessions);
      expect(result).toHaveLength(2);
    });
  });
});
