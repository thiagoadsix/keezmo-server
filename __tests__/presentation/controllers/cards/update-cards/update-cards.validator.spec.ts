import { beforeEach, describe, expect, it } from "vitest";

import { UpdateCardsValidator } from "@/presentation/controllers/cards/update-cards/update-cards.validator";
import { ValidationError } from "@/presentation/errors/validation-error";

describe("UpdateCardsValidator", () => {
  let validator: UpdateCardsValidator;

  beforeEach(() => {
    validator = new UpdateCardsValidator();
  });

  it("should validate a valid update cards request", () => {
    const validRequest = {
      params: {
        deckId: "deck-123",
      },
      body: {
        cards: [
          {
            id: "card-1",
            question: "Updated Question 1",
            answer: "Updated Answer 1",
          },
        ],
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual({
      deckId: validRequest.params.deckId,
      cards: validRequest.body.cards,
    });
  });

  it("should validate request with only question update", () => {
    const validRequest = {
      params: {
        deckId: "deck-123",
      },
      body: {
        cards: [
          {
            id: "card-1",
            question: "Updated Question 1",
          },
        ],
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual({
      deckId: validRequest.params.deckId,
      cards: validRequest.body.cards,
    });
  });

  it("should validate request with only answer update", () => {
    const validRequest = {
      params: {
        deckId: "deck-123",
      },
      body: {
        cards: [
          {
            id: "card-1",
            answer: "Updated Answer 1",
          },
        ],
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual({
      deckId: validRequest.params.deckId,
      cards: validRequest.body.cards,
    });
  });

  it("should throw ValidationError if deckId is empty", () => {
    const invalidRequest = {
      params: {
        deckId: "",
      },
      body: {
        cards: [
          {
            id: "card-1",
            question: "Updated Question 1",
            answer: "Updated Answer 1",
          },
        ],
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if cards array is empty", () => {
    const invalidRequest = {
      params: {
        deckId: "deck-123",
      },
      body: {
        cards: [],
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if card id is empty", () => {
    const invalidRequest = {
      params: {
        deckId: "deck-123",
      },
      body: {
        cards: [
          {
            id: "",
            question: "Updated Question 1",
            answer: "Updated Answer 1",
          },
        ],
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if card has neither question nor answer", () => {
    const invalidRequest = {
      params: {
        deckId: "deck-123",
      },
      body: {
        cards: [
          {
            id: "card-1",
          },
        ],
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
