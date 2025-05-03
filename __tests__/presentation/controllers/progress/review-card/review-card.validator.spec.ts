import { beforeEach, describe, expect, it } from "vitest";

import { DifficultyEnum } from "@/domain/value-objects";
import { ValidationError } from "@/presentation/errors/validation-error";

import { ReviewCardValidator } from "@/presentation/controllers/progress/review-card";

describe("ReviewCardValidator", () => {
  let validator: ReviewCardValidator;

  beforeEach(() => {
    validator = new ReviewCardValidator();
  });

  it("should validate a valid review card request", () => {
    const validRequest = {
      params: {
        cardId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      body: {
        difficulty: DifficultyEnum.HARD,
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual(validRequest);
  });

  it("should throw ValidationError if cardId is not a valid UUID", () => {
    const invalidRequest = {
      params: {
        cardId: "invalid-uuid",
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      body: {
        difficulty: DifficultyEnum.HARD,
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if deckId is not a valid UUID", () => {
    const invalidRequest = {
      params: {
        cardId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "invalid-uuid",
      },
      body: {
        difficulty: DifficultyEnum.HARD,
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if difficulty is invalid", () => {
    const invalidRequest = {
      params: {
        cardId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      body: {
        difficulty: "INVALID_DIFFICULTY" as DifficultyEnum,
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError when params are missing", () => {
    const invalidRequest = {
      body: {
        difficulty: DifficultyEnum.HARD,
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError when body is missing", () => {
    const invalidRequest = {
      params: {
        cardId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
