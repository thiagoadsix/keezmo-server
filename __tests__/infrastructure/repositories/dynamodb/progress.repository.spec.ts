import { describe, it, expect, beforeEach } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

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