import { describe, expect, it } from "vitest";

import { Progress } from "@/domain/entities/progress";

import { ProgressDynamoSchema } from "@/infrastructure/repository/dynamodb/schemas/progress.schema";

describe("ProgressDynamoSchema", () => {
  it("should be able to create a progress dynamo schema", () => {
    const progress = new Progress({
      id: "1",
      cardId: "1",
      deckId: "1",
      repetitions: 1,
      interval: 1,
      easeFactor: 1,
      nextReview: "2021-01-01",
      lastReviewed: "2021-01-01",
    });
    const progressDynamoSchema = new ProgressDynamoSchema(progress);

    expect(progressDynamoSchema).toBeDefined();
    expect(progressDynamoSchema.id).toBe(progress.id);
    expect(progressDynamoSchema.cardId).toBe(progress.cardId);
    expect(progressDynamoSchema.deckId).toBe(progress.deckId);
  });

  it("should build a primary key (PK) from a deck ID", () => {
    const deckId = "deck-123";
    const pk = ProgressDynamoSchema.buildPK(deckId);

    expect(pk).toBe("DECK#deck-123");
  });

  it("should build a sort key (SK) from a card ID", () => {
    const cardId = "card-456";
    const sk = ProgressDynamoSchema.buildSK(cardId);

    expect(sk).toBe("CARD#card-456");
  });

  it("should build a GSI1PK from a card ID", () => {
    const cardId = "card-789";
    const gsi1pk = ProgressDynamoSchema.buildGSI1PK(cardId);

    expect(gsi1pk).toBe("CARD#card-789");
  });

  it("should build a GSI1SK from a card ID", () => {
    const cardId = "card-abc";
    const gsi1sk = ProgressDynamoSchema.buildGSI1SK(cardId);

    expect(gsi1sk).toBe("CARD#card-abc");
  });

  it("should marshall a progress schema to DynamoDB format", () => {
    const progress = new Progress({
      id: "1",
      cardId: "1",
      deckId: "1",
      repetitions: 1,
      interval: 1,
      easeFactor: 1,
      nextReview: "2021-01-01",
      lastReviewed: "2021-01-01",
    });

    const progressDynamoSchema = new ProgressDynamoSchema(progress);
    const marshalled = progressDynamoSchema.toMarshall();

    expect(marshalled).toBeDefined();
    expect(typeof marshalled).toBe("object");
  });

  it("should create a Progress entity from a DynamoDB item", () => {
    const mockDynamoItem = {
      id: { S: "1" },
      cardId: { S: "1" },
      deckId: { S: "1" },
      repetitions: { N: "1" },
      interval: { N: "1" },
      easeFactor: { N: "1" },
      nextReview: { S: "2021-01-01" },
      lastReviewed: { S: "2021-01-01" },
      createdAt: { S: "2021-01-01" },
      updatedAt: { S: "2021-01-01" },
    };

    const progress = ProgressDynamoSchema.fromDynamoItem(mockDynamoItem);

    expect(progress).toBeInstanceOf(Progress);
    expect(progress.id).toBe("1");
    expect(progress.cardId).toBe("1");
    expect(progress.deckId).toBe("1");
  });
});
