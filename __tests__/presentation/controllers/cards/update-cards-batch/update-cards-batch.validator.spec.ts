import { beforeEach, describe, expect, it } from "vitest";

import { UpdateCardsBatchValidator } from "@/presentation/controllers/cards/update-cards-batch";
import { ValidationError } from "@/presentation/errors/validation-error";

describe("UpdateCardsBatchValidator", () => {
  let validator: UpdateCardsBatchValidator;

  beforeEach(() => {
    validator = new UpdateCardsBatchValidator();
  });

  it("should validate a valid update cards request", () => {
    const validRequest = {
      user: {
        id: "user-123",
      },
      params: {
        deckId: "deck-123",
      },
      body: [
        {
          id: "card-1",
          question: "Updated Question 1",
          answer: "Updated Answer 1",
        },
      ],
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual({
      deckId: validRequest.params.deckId,
      userId: validRequest.user.id,
      cards: validRequest.body,
    });
  });

  it("should validate request with only question update", () => {
    const validRequest = {
      user: {
        id: "user-123",
      },
      params: {
        deckId: "deck-123",
      },
      body: [
        {
          id: "card-1",
          question: "Updated Question 1",
        },
      ],
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual({
      deckId: validRequest.params.deckId,
      userId: validRequest.user.id,
      cards: validRequest.body,
    });
  });

  it("should validate request with only answer update", () => {
    const validRequest = {
      user: {
        id: "user-123",
      },
      params: {
        deckId: "deck-123",
      },
      body: [
        {
          id: "card-1",
          answer: "Updated Answer 1",
        },
      ],
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual({
      deckId: validRequest.params.deckId,
      userId: validRequest.user.id,
      cards: validRequest.body,
    });
  });

  it("should throw ValidationError if user id is empty", () => {
    const invalidRequest = {
      user: {
        id: "",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if deckId is empty", () => {
    const invalidRequest = {
      user: {
        id: "user-123",
      },
      params: {
        deckId: "",
      },
      body: [
        {
          id: "card-1",
          question: "Updated Question 1",
          answer: "Updated Answer 1",
        },
      ],
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if cards array is empty", () => {
    const invalidRequest = {
      user: {
        id: "user-123",
      },
      params: {
        deckId: "deck-123",
      },
      body: [],
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if card id is empty", () => {
    const invalidRequest = {
      user: {
        id: "user-123",
      },
      params: {
        deckId: "deck-123",
      },
      body: [
        {
          id: "",
          question: "Updated Question 1",
          answer: "Updated Answer 1",
        },
      ],
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if card has neither question nor answer", () => {
    const invalidRequest = {
      user: {
        id: "user-123",
      },
      params: {
        deckId: "deck-123",
      },
      body: [
        {
          id: "card-1",
        },
      ],
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
