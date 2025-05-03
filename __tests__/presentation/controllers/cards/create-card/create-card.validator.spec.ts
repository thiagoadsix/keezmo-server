import { beforeEach, describe, expect, it } from "vitest";

import { CreateCardValidator } from "@/presentation/controllers/cards/create-card";
import { ValidationError } from "@/presentation/errors/validation-error";

describe("CreateCardValidator", () => {
  let validator: CreateCardValidator;

  beforeEach(() => {
    validator = new CreateCardValidator();
  });

  it("should validate a valid create card request", () => {
    const validRequest = {
      params: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      body: {
        question: "What is the capital of France?",
        answer: "Paris",
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
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      body: {
        question: "What is the capital of France?",
        answer: "Paris",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if question is empty", () => {
    const invalidRequest = {
      params: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      body: {
        question: "",
        answer: "Paris",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if answer is empty", () => {
    const invalidRequest = {
      params: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      body: {
        question: "What is the capital of France?",
        answer: "",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if userId is not a valid string", () => {
    const invalidRequest = {
      params: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: 123,
      },
      body: {
        question: "What is the capital of France?",
        answer: "Paris",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
