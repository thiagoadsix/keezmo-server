import { describe, expect, it } from "vitest";

import { Deck } from "@/domain/entities/deck";

import { DeckDynamoSchema } from "@/infrastructure/repository/dynamodb/schemas/deck.schema";
import { validDeckProps } from "__tests__/@support/fixtures/deck.fixtures";

describe("DeckDynamoSchema", () => {
  it("should be able to create a deck dynamo schema", () => {
    const deck = new Deck({ ...validDeckProps });
    const deckDynamoSchema = new DeckDynamoSchema(deck);

    expect(deckDynamoSchema).toBeDefined();
    expect(deckDynamoSchema.id).toBe(deck.id);
    expect(deckDynamoSchema.userId).toBe(deck.userId);
    expect(deckDynamoSchema.title).toBe(deck.title);
    expect(deckDynamoSchema.description).toBe(deck.description);
  })
})

