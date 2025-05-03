import { beforeEach, describe, expect, it } from "vitest";

import { StudyModeEnum } from "@/domain/value-objects";
import { ValidationError } from "@/presentation/errors/validation-error";

import { StartStudySessionValidator } from "@/presentation/controllers/study-session/start-study-session";

describe("StartStudySessionValidator", () => {
  let validator: StartStudySessionValidator;

  beforeEach(() => {
    validator = new StartStudySessionValidator();
  });

  it("should validate a valid start study session request", () => {
    const validRequest = {
      body: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d5",
        studyMode: StudyModeEnum.FLASHCARD,
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual(validRequest);
  });

  it("should throw ValidationError if deckId is not a valid UUID", () => {
    const invalidRequest = {
      body: {
        deckId: "invalid-uuid",
        userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d5",
        studyMode: StudyModeEnum.FLASHCARD,
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if userId is not a valid UUID", () => {
    const invalidRequest = {
      body: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        userId: "invalid-uuid",
        studyMode: StudyModeEnum.FLASHCARD,
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if studyMode is invalid", () => {
    const invalidRequest = {
      body: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        userId: "3fa1adbb-6beb-4d46-813b-9ece825d39d5",
        studyMode: "INVALID_MODE" as StudyModeEnum,
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError when body is missing", () => {
    const invalidRequest = {};

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError when required fields are missing", () => {
    const invalidRequest = {
      body: {
        // Missing all required fields
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
