import { describe, it, expect, beforeEach } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, GetItemCommand, QueryCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

import { ProgressDynamoRepository } from "@/infrastructure/repository/dynamodb/progress.repository";
import { Progress } from "@/domain/entities/progress";
import { validProgressProps } from "__tests__/@support/fixtures/progress.fixtures";
import { marshall } from "@aws-sdk/util-dynamodb";

const dynamoMock = mockClient(new DynamoDBClient({}));

describe("ProgressDynamoRepository", () => {
  let repository: ProgressDynamoRepository;

  beforeEach(() => {
    dynamoMock.reset();
    repository = new ProgressDynamoRepository(dynamoMock as any);
  });

  it('should be able to save a progress', async () => {
    const progress = new Progress(validProgressProps)

    await repository.save(progress)

    expect(dynamoMock.calls()).toHaveLength(1)
  })

  it('should be able to delete a progress', async () => {
    const progress = new Progress(validProgressProps)

    await repository.save(progress)

    await repository.deleteById(progress.id)
  })

  it('should be able to delete a progress by deck id', async () => {
    const progress = new Progress(validProgressProps)

    await repository.save(progress)

    await repository.deleteByDeckId(progress.deckId)
  })

  it('should be able to save a batch of progresses', async () => {
    const progresses = [
      new Progress(validProgressProps),
      new Progress(validProgressProps),
    ]

    await repository.saveBatch(progresses)

    expect(dynamoMock.calls()).toHaveLength(1)
  })

  it('should be able to find due progresses', async () => {
    const progresses = [
      new Progress({
        ...validProgressProps,
        nextReview: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      }),
      new Progress({
        ...validProgressProps,
        nextReview: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      }),
    ]

    dynamoMock.on(QueryCommand).resolves({
      Items: progresses.map(progress => marshall(progress, {
        convertClassInstanceToMap: true,
        removeUndefinedValues: true,
      })),
    })

    await repository.saveBatch(progresses)

    const result = await repository.findDueCards(new Date())

    expect(result).toHaveLength(2)
  })

  it('should be able to update a progress', async () => {
    const progress = new Progress(validProgressProps)

    await repository.save(progress)

    const updated = new Progress({
      ...progress,
      interval: 2,
      repetitions: 2,
      easeFactor: 2.6,
      lastReviewed: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      nextReview: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    })

    dynamoMock.on(UpdateItemCommand).resolves({})

    await repository.update(updated)

    expect(dynamoMock.calls()).toHaveLength(2)
    expect(progress.id).toBe(updated.id)
    expect(progress.nextReview).not.toBe(updated.nextReview)
  })

  describe('findByCardAndDeck', () => {
    it('should be able to find a progress by card and deck', async () => {
      const progress = new Progress(validProgressProps)

      dynamoMock.on(GetItemCommand).resolves({
        Item: marshall(progress, {
          convertClassInstanceToMap: true,
          removeUndefinedValues: true,
        }),
      });

      await repository.save(progress)

      const result = await repository.findByCardAndDeck(progress.cardId, progress.deckId)

      expect(result).toBeDefined()
      expect(result?.id).toBe(progress.id)
    })

    it('should return null if the progress is not found', async () => {
      dynamoMock.on(GetItemCommand).resolves({})

      const result = await repository.findByCardAndDeck(validProgressProps.cardId, validProgressProps.deckId)

      expect(result).toBeNull()
    })
  })
})