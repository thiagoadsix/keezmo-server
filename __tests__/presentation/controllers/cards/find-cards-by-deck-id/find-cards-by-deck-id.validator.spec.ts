import { beforeEach, describe, expect, it } from "vitest";

import { FindCardsByDeckIdValidator } from "@/presentation/controllers/cards/find-cards-by-deck-id";
import { ValidationError } from "@/presentation/errors/validation-error";

describe("FindCardsByDeckIdValidator", () => {
  let validator: FindCardsByDeckIdValidator;

  beforeEach(() => {
    validator = new FindCardsByDeckIdValidator();
  });

  it("should validate a valid find cards by deck id request", () => {
    const validRequest = {
      params: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual(validRequest);
  });

  it("should throw ValidationError if deckId is not a valid uuid", () => {
    const invalidRequest = {
      params: {
        deckId: "invalid-uuid",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if deckId is missing", () => {
    const invalidRequest = {
      params: {},
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if params is missing", () => {
    const invalidRequest = {};

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
