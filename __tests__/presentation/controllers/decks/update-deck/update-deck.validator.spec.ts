import { beforeEach, describe, expect, it } from "vitest";

import { UpdateDeckValidator } from "@/presentation/controllers/decks/update-deck";
import { ValidationError } from "@/presentation/errors/validation-error";

describe("UpdateDeckValidator", () => {
  let validator: UpdateDeckValidator;

  beforeEach(() => {
    validator = new UpdateDeckValidator();
  });

  it("should validate a valid update deck request", () => {
    const validRequest = {
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      body: {
        title: "Updated Deck Title",
        description: "Updated description",
        studyMode: "spaced",
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual(validRequest);
  });

  it("should validate a request with partial body updates", () => {
    const validRequest = {
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      body: {
        title: "New Title",
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
      body: {
        title: "Updated Deck Title",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if title is empty", () => {
    const invalidRequest = {
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      body: {
        title: "",
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
      body: {
        title: "Updated Deck Title",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
