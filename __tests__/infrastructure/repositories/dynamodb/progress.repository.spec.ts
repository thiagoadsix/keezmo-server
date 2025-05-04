import {
  DynamoDBClient,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { beforeEach, describe, expect, it } from "vitest";
import { marshall } from "@aws-sdk/util-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

import { Progress } from "@/domain/entities/progress";
import { ProgressDynamoRepository } from "@/infrastructure/repository/dynamodb/progress.repository";

import { ProgressDynamoSchema } from "@/infrastructure/repository/dynamodb/schemas/progress.schema";

import { validProgressProps } from "__tests__/@support/fixtures/progress.fixtures";

const dynamoMock = mockClient(new DynamoDBClient({}));

describe("ProgressDynamoRepository", () => {
  let repository: ProgressDynamoRepository;

  beforeEach(() => {
    dynamoMock.reset();
    repository = new ProgressDynamoRepository(
      dynamoMock as unknown as DynamoDBClient
    );
  });

  it("should be able to save a progress", async () => {
    const progress = new Progress(validProgressProps);

    await repository.save(progress);

    expect(dynamoMock.calls()).toHaveLength(1);
  });

  it("should be able to delete a progress", async () => {
    const progress = new Progress(validProgressProps);

    await repository.save(progress);

    await repository.deleteByIdAndDeckId(progress.id, progress.deckId);
  });

  it("should be able to delete a progress by deck id", async () => {
    const progress = new Progress(validProgressProps);

    await repository.save(progress);

    await repository.deleteByDeckId(progress.deckId);
  });

  it("should be able to save a batch of progresses", async () => {
    const progresses = [
      new Progress(validProgressProps),
      new Progress(validProgressProps),
    ];

    await repository.saveBatch(progresses);

    expect(dynamoMock.calls()).toHaveLength(1);
  });

  describe("findDueCards", () => {
    it("should be able to find due progresses with specific deckId", async () => {
      const dueDate = new Date();
      const deckId = "deck-123";
      const progresses = [
        new Progress({
          ...validProgressProps,
          deckId,
          nextReview: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        }),
        new Progress({
          ...validProgressProps,
          deckId,
          nextReview: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        }),
      ];

      dynamoMock.on(QueryCommand).resolves({
        Items: progresses.map((progress) =>
          marshall(progress, {
            convertClassInstanceToMap: true,
            removeUndefinedValues: true,
          })
        ),
      });

      const result = await repository.findDueCards(dueDate, deckId);

      const calls = dynamoMock.commandCalls(QueryCommand);
      expect(calls).toHaveLength(1);

      const call = calls[0];
      const input = call.args[0].input;

      expect(input.KeyConditionExpression).toBe(
        "PK = :pk and begins_with(SK, :sk)"
      );
      expect(input.FilterExpression).toBe("nextReview <= :date");

      expect(input.ExpressionAttributeValues).toBeDefined();
      if (input.ExpressionAttributeValues) {
        expect(input.ExpressionAttributeValues[":pk"].S).toBe(
          ProgressDynamoSchema.buildPK(deckId)
        );
        expect(input.ExpressionAttributeValues[":sk"].S).toBe("PROGRESS#");
        expect(input.ExpressionAttributeValues[":date"].S).toBe(
          dueDate.toISOString()
        );
      }

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Progress);
      expect(result[1]).toBeInstanceOf(Progress);
    });

    it("should return empty array when no items found", async () => {
      const dueDate = new Date();

      dynamoMock.on(QueryCommand).resolves({
        Items: [],
      });

      const result = await repository.findDueCards(dueDate, "deck-123");

      expect(result).toEqual([]);
    });

    it("should return empty array when Items is undefined", async () => {
      const dueDate = new Date();

      dynamoMock.on(QueryCommand).resolves({
        Items: undefined,
      });

      const result = await repository.findDueCards(dueDate, "deck-123");

      expect(result).toEqual([]);
    });
  });

  it("should be able to update a progress", async () => {
    const progress = new Progress(validProgressProps);

    await repository.save(progress);

    const updated = new Progress({
      ...progress,
      interval: 2,
      repetitions: 2,
      easeFactor: 2.6,
      lastReviewed: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      nextReview: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    });

    dynamoMock.on(UpdateItemCommand).resolves({});

    await repository.update(updated);

    expect(dynamoMock.calls()).toHaveLength(2);
    expect(progress.id).toBe(updated.id);
    expect(progress.nextReview).not.toBe(updated.nextReview);
  });

  describe("findByCardAndDeck", () => {
    it("should be able to find a progress by card and deck", async () => {
      const progress = new Progress(validProgressProps);

      dynamoMock.on(QueryCommand).resolves({
        Items: [
          marshall(progress, {
            convertClassInstanceToMap: true,
            removeUndefinedValues: true,
          }),
        ],
      });

      await repository.save(progress);

      const result = await repository.findByCardAndDeck(
        progress.cardId,
        progress.deckId
      );

      expect(result).toBeDefined();
      expect(result?.id).toBe(progress.id);
    });

    it("should return null if the progress is not found", async () => {
      dynamoMock.on(QueryCommand).resolves({
        Items: [],
      });

      const result = await repository.findByCardAndDeck(
        validProgressProps.cardId,
        validProgressProps.deckId
      );

      expect(result).toBeNull();
    });
  });
});
