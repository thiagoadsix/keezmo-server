import { beforeEach, describe, expect, it } from "vitest";

import { FindDecksByUserValidator } from "@/presentation/controllers/decks/find-decks-by-user";
import { ValidationError } from "@/presentation/errors/validation-error";

describe("FindDecksByUserValidator", () => {
  let validator: FindDecksByUserValidator;

  beforeEach(() => {
    validator = new FindDecksByUserValidator();
  });

  it("should validate a valid find decks by user request", () => {
    const validRequest = {
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual(validRequest);
  });

  it("should throw ValidationError if userId is not a valid string", () => {
    const invalidRequest = {
      user: {
        id: 123,
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if user is missing", () => {
    const invalidRequest = {};

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
