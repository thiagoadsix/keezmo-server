import { describe, it, expect } from "vitest";

import { Progress } from "@/domain/entities/progress";

import { ProgressDynamoSchema } from "@/infrastructure/repository/dynamodb/schemas/progress.schema";

describe("ProgressDynamoSchema", () => {
  it("should be able to create a progress dynamo schema", () => {
    const progress = new Progress({ id: "1", cardId: "1", deckId: "1", repetitions: 1, interval: 1, easeFactor: 1, nextReview: "2021-01-01", lastReviewed: "2021-01-01" });
    const progressDynamoSchema = new ProgressDynamoSchema(progress);

    expect(progressDynamoSchema).toBeDefined();
    expect(progressDynamoSchema.id).toBe(progress.id);
    expect(progressDynamoSchema.cardId).toBe(progress.cardId);
    expect(progressDynamoSchema.deckId).toBe(progress.deckId);

  });
});
