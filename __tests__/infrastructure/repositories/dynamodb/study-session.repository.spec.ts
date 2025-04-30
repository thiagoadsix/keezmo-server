import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetItemCommand, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { StudySessionDynamoRepository } from '@/infrastructure/repository/dynamodb/study-session.repository';

import { validFlashcardSessionProps } from '__tests__/@support/fixtures/study-session.fixtures';

const dynamoMock = mockClient(new DynamoDBClient({}));

describe('StudySessionDynamoRepository', () => {
  let repository: StudySessionDynamoRepository;

  beforeEach(() => {
    dynamoMock.reset();
    repository = new StudySessionDynamoRepository(dynamoMock as any);
  });

  describe('findById', () => {
    it('should be able to find a study session by id', async () => {
      dynamoMock.on(GetItemCommand).resolves({
        Item: marshall(validFlashcardSessionProps, {
          convertClassInstanceToMap: true,
          removeUndefinedValues: true,
        }),
      });

      const result = await repository.findById(validFlashcardSessionProps.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(validFlashcardSessionProps.id);
      expect(result?.deckId).toBe(validFlashcardSessionProps.deckId);
    })

    it('should return null if the study session is not found', async () => {
      dynamoMock.on(GetItemCommand).resolves({});

      const result = await repository.findById(validFlashcardSessionProps.id);

      expect(result).toBeNull();
    })
  })
})