import { beforeEach, describe, expect, it } from "vitest";

import { FindDueCardsValidator } from "@/presentation/controllers/progress/find-due-cards";
import { ValidationError } from "@/presentation/errors/validation-error";

describe("FindDueCardsValidator", () => {
  let validator: FindDueCardsValidator;

  beforeEach(() => {
    validator = new FindDueCardsValidator();
  });

  it("should validate a valid find due cards request", () => {
    const validRequest = {
      params: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      query: {
        date: "2021-01-01",
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual({
      deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      date: new Date("2021-01-01"),
    });
  });

  it("should throw ValidationError if deckId is not a valid uuid", () => {
    const invalidRequest = {
      params: {
        deckId: "invalid-uuid",
      },
      query: {
        date: "2021-01-01",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if date is not a valid date", () => {
    const invalidRequest = {
      params: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      query: {
        date: "invalid-date",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if deckId is not a valid uuid", () => {
    const invalidRequest = {
      params: {
        deckId: "invalid-uuid",
      },
      query: {
        date: "2021-01-01",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
