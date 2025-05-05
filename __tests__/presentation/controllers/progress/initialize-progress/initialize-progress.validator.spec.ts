import { beforeEach, describe, expect, it } from "vitest";

import { ValidationError } from "@/presentation/errors/validation-error";

import { InitializeProgressValidator } from "@/presentation/controllers/progress/initialize-progress";

describe("InitializeProgressValidator", () => {
  let validator: InitializeProgressValidator;

  beforeEach(() => {
    validator = new InitializeProgressValidator();
  });

  it("should validate a valid initialize progress request", () => {
    const validRequest = {
      params: {
        cardId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual({
      cardId: validRequest.params.cardId,
      deckId: validRequest.params.deckId,
    });
  });

  it("should throw ValidationError if cardId is not a valid UUID", () => {
    const invalidRequest = {
      params: {
        cardId: "invalid-uuid",
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d5",
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
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError when params are missing", () => {
    const invalidRequest = {};

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError when cardId is missing", () => {
    const invalidRequest = {
      params: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError when deckId is missing", () => {
    const invalidRequest = {
      params: {
        cardId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
