import { beforeEach, describe, expect, it } from "vitest";

import { CreateCardsBatchValidator } from "@/presentation/controllers/cards/create-cards-batch";
import { ValidationError } from "@/presentation/errors/validation-error";

describe("CreateCardsBatchValidator", () => {
  let validator: CreateCardsBatchValidator;

  beforeEach(() => {
    validator = new CreateCardsBatchValidator();
  });

  it("should validate a valid create cards batch request", () => {
    const validRequest = {
      params: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      body: {
        cards: [
          {
            question: "What is the capital of France?",
            answer: "Paris",
          },
          {
            question: "What is the capital of Germany?",
            answer: "Berlin",
          },
        ],
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual(validRequest);
  });

  it("should validate a request with an empty cards array", () => {
    const validRequest = {
      params: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      body: {
        cards: [],
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
        cards: [
          {
            question: "What is the capital of France?",
            answer: "Paris",
          },
        ],
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if card question is empty", () => {
    const invalidRequest = {
      params: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      body: {
        cards: [
          {
            question: "",
            answer: "Paris",
          },
        ],
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if card answer is empty", () => {
    const invalidRequest = {
      params: {
        deckId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      body: {
        cards: [
          {
            question: "What is the capital of France?",
            answer: "",
          },
        ],
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
        cards: [
          {
            question: "What is the capital of France?",
            answer: "Paris",
          },
        ],
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
