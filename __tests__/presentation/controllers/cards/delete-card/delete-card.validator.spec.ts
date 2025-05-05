import { beforeEach, describe, expect, it } from "vitest";

import { DeleteCardValidator } from "@/presentation/controllers/cards/delete-card";
import { ValidationError } from "@/presentation/errors/validation-error";

describe("DeleteCardValidator", () => {
  let validator: DeleteCardValidator;

  beforeEach(() => {
    validator = new DeleteCardValidator();
  });

  it("should validate a valid delete card request", () => {
    const validRequest = {
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      user: {
        id: "5fa1adbb-6beb-4d46-813b-9ece825d39d6",
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual({
      id: validRequest.params.id,
      deckId: validRequest.params.deckId,
      userId: validRequest.user.id,
    });
  });

  it("should throw ValidationError if card id is not a valid uuid", () => {
    const invalidRequest = {
      params: {
        id: "invalid-uuid",
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      user: {
        id: "5fa1adbb-6beb-4d46-813b-9ece825d39d6",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if deck id is not a valid uuid", () => {
    const invalidRequest = {
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "invalid-uuid",
      },
      user: {
        id: "5fa1adbb-6beb-4d46-813b-9ece825d39d6",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if userId is not a valid string", () => {
    const invalidRequest = {
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      user: {
        id: 123,
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
