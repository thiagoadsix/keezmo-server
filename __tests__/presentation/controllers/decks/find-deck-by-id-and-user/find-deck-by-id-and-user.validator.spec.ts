import { beforeEach, describe, expect, it } from "vitest";

import { FindDeckByIdAndUserValidator } from "@/presentation/controllers/decks/find-deck-by-id-and-user/find-deck-by-id-and-user.validator";
import { ValidationError } from "@/presentation/errors/validation-error";

describe("FindDeckByIdAndUserValidator", () => {
  let validator: FindDeckByIdAndUserValidator;

  beforeEach(() => {
    validator = new FindDeckByIdAndUserValidator();
  });

  it("should validate a valid find deck by id and user request", () => {
    const validRequest = {
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual(validRequest);
  });

  it("should throw ValidationError if id is not a valid uuid", () => {
    const invalidRequest = {
      params: {
        id: "invalid-uuid",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if userId is not a valid string", () => {
    const invalidRequest = {
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: 123,
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
