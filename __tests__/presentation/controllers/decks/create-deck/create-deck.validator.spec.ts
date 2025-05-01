import { beforeEach, describe, expect, it } from "vitest";

import { StudyModeEnum } from "@/domain/value-objects";
import { ValidationError } from "@/presentation/errors/validation-error";

import { CreateDeckValidator } from "@/presentation/controllers/decks/create-deck";

describe("CreateDeckValidator", () => {
  let validator: CreateDeckValidator;

  beforeEach(() => {
    validator = new CreateDeckValidator();
  });

  it("should validate a valid create deck request", () => {
    const validRequest = {
      userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      title: "Sample Deck",
      description: "A sample deck for testing",
      studyMode: StudyModeEnum.FLASHCARD,
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual(validRequest);
  });

  it("should throw ValidationError if title is empty", () => {
    const invalidRequest = {
      userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      title: "",
      description: "A sample deck for testing",
      studyMode: StudyModeEnum.FLASHCARD,
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if userId is not a valid string", () => {
    const invalidRequest = {
      userId: 123,
      title: "Sample Deck",
      description: "A sample deck for testing",
      studyMode: StudyModeEnum.FLASHCARD,
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if studyMode is invalid", () => {
    const invalidRequest = {
      userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      title: "Sample Deck",
      description: "A sample deck for testing",
      studyMode: "invalid_mode" as StudyModeEnum,
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should validate cards if provided", () => {
    const validRequest = {
      userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      title: "Sample Deck",
      description: "A sample deck for testing",
      studyMode: StudyModeEnum.FLASHCARD,
      cards: [
        {
          question: "Question 1",
          answer: "Answer 1",
        },
      ],
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual(validRequest);
  });

  it("should throw ValidationError if card question is empty", () => {
    const invalidRequest = {
      userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      title: "Sample Deck",
      description: "A sample deck for testing",
      studyMode: StudyModeEnum.FLASHCARD,
      cards: [
        {
          question: "",
          answer: "Answer 1",
        },
      ],
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
