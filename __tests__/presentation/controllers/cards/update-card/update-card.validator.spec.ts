import { beforeEach, describe, expect, it } from "vitest";

import { UpdateCardValidator } from "@/presentation/controllers/cards/update-card";
import { ValidationError } from "@/presentation/errors/validation-error";

describe("UpdateCardValidator", () => {
  let validator: UpdateCardValidator;

  beforeEach(() => {
    validator = new UpdateCardValidator();
  });

  it("should validate a valid update card request with full data", () => {
    const validRequest = {
      user: {
        id: "user-123",
      },
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      body: {
        question: "What is the capital of France?",
        answer: "Paris",
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual({
      id: validRequest.params.id,
      deckId: validRequest.params.deckId,
      userId: validRequest.user.id,
      data: validRequest.body,
    });
  });

  it("should validate a request with only question update", () => {
    const validRequest = {
      user: {
        id: "user-123",
      },
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      body: {
        question: "Updated question?",
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual({
      id: validRequest.params.id,
      deckId: validRequest.params.deckId,
      userId: validRequest.user.id,
      data: validRequest.body,
    });
  });

  it("should validate a request with only answer update", () => {
    const validRequest = {
      user: {
        id: "user-123",
      },
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      body: {
        answer: "Updated answer",
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual({
      id: validRequest.params.id,
      deckId: validRequest.params.deckId,
      userId: validRequest.user.id,
      data: validRequest.body,
    });
  });

  it("should throw ValidationError if card id is not a valid uuid", () => {
    const invalidRequest = {
      user: {
        id: "user-123",
      },
      params: {
        id: "invalid-uuid",
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      body: {
        question: "What is the capital of France?",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if deck id is not a valid uuid", () => {
    const invalidRequest = {
      user: {
        id: "user-123",
      },
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "invalid-uuid",
      },
      body: {
        question: "What is the capital of France?",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if question is empty", () => {
    const invalidRequest = {
      user: {
        id: "user-123",
      },
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      body: {
        question: "",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if answer is empty", () => {
    const invalidRequest = {
      user: {
        id: "user-123",
      },
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      body: {
        answer: "",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if user id is not a valid string", () => {
    const invalidRequest = {
      user: {
        id: 123,
      },
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      body: {
        question: "What is the capital of France?",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if no update fields are provided", () => {
    const invalidRequest = {
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        deckId: "4fa1adbb-6beb-4d46-813b-9ece825d39d5",
      },
      body: {},
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
