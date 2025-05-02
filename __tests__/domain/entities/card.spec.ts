import {
  generateIdMock,
  mockId,
} from "__tests__/@support/mocks/shared/utils/generate-id.mock";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  invalidCardPropsWithEmptyAnswer,
  invalidCardPropsWithEmptyQuestion,
  validCardProps,
} from "__tests__/@support/fixtures/card.fixtures";

import { Card } from "@/domain/entities/card";
import { InvalidCardAnswerError } from "@/domain/errors/card/invalid-card-answer-error";
import { InvalidCardQuestionError } from "@/domain/errors/card/invalid-card-question-error";

describe("Card", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    generateIdMock.mockReturnValue(mockId);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  describe("constructor", () => {
    it("should create a valid Card entity with basic properties", () => {
      const fixedDate = new Date("2023-01-01T12:00:00Z");
      vi.setSystemTime(fixedDate);
      const expectedDateString = fixedDate.toISOString();

      const card = new Card(validCardProps);

      expect(card).toBeInstanceOf(Card);
      expect(card.id).toBe(mockId);
      expect(card.deckId).toBe(validCardProps.deckId);
      expect(card.question).toBe(validCardProps.question);
      expect(card.answer).toBe(validCardProps.answer);
      expect(card.createdAt).toBe(expectedDateString);
      expect(card.updatedAt).toBe(expectedDateString);
      expect(generateIdMock).toHaveBeenCalledTimes(1);
    });

    it("should create a Card with specified id, createdAt and updatedAt", () => {
      const createdAt = "2023-01-01T10:00:00Z";
      const updatedAt = "2023-01-02T10:00:00Z";

      const card = new Card({
        ...validCardProps,
        createdAt,
        updatedAt,
      });

      expect(card.createdAt).toBe(createdAt);
      expect(card.updatedAt).toBe(updatedAt);
    });

    it("should throw InvalidCardQuestionError when question is empty", () => {
      expect(() => new Card(invalidCardPropsWithEmptyQuestion)).toThrow(
        InvalidCardQuestionError
      );
    });

    it("should throw InvalidCardAnswerError when answer is empty", () => {
      expect(() => new Card(invalidCardPropsWithEmptyAnswer)).toThrow(
        InvalidCardAnswerError
      );
    });
  });

  describe("updateQuestion", () => {
    it("should update the question and updatedAt", () => {
      const card = new Card(validCardProps);
      const newQuestion = "What is the capital of Germany?";
      const fixedDate = new Date("2023-01-02T12:00:00Z");
      vi.setSystemTime(fixedDate);
      const expectedDateString = fixedDate.toISOString();

      card.updateQuestion(newQuestion);

      expect(card.question).toBe(newQuestion);
      expect(card.updatedAt).toBe(expectedDateString);
    });

    it("should throw InvalidCardQuestionError when new question is empty", () => {
      const card = new Card(validCardProps);

      expect(() => card.updateQuestion("")).toThrow(InvalidCardQuestionError);
    });
  });

  describe("updateAnswer", () => {
    it("should update the answer and updatedAt", () => {
      const card = new Card(validCardProps);
      const newAnswer = "Berlin";
      const fixedDate = new Date("2023-01-02T12:00:00Z");
      vi.setSystemTime(fixedDate);
      const expectedDateString = fixedDate.toISOString();

      card.updateAnswer(newAnswer);

      expect(card.answer).toBe(newAnswer);
      expect(card.updatedAt).toBe(expectedDateString);
    });

    it("should throw InvalidCardAnswerError when new answer is empty", () => {
      const card = new Card(validCardProps);

      expect(() => card.updateAnswer("")).toThrow(InvalidCardAnswerError);
    });
  });
});
