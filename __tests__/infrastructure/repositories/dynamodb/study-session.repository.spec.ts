import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { StudySessionDynamoRepository } from '@/infrastructure/repository/dynamodb/study-session.repository';

import { validFlashcardSessionProps } from '__tests__/@support/fixtures/study-session.fixtures';
import { StudySession } from '@/domain/entities/study-session';

const dynamoMock = mockClient(new DynamoDBClient({}));

describe('StudySessionDynamoRepository', () => {
  let repository: StudySessionDynamoRepository;

  beforeEach(() => {
    dynamoMock.reset();
    repository = new StudySessionDynamoRepository(dynamoMock as any);
  });

  it('should be able to save a study session', async () => {
    const studySession = new StudySession(validFlashcardSessionProps);

    await repository.save(studySession);

    expect(dynamoMock.calls()).toHaveLength(1);
  })

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

  describe('findByUserId', () => {
    it('should be able to find a study session by user id', async () => {
      dynamoMock.on(QueryCommand).resolves({
        Items: [marshall(validFlashcardSessionProps, {
          convertClassInstanceToMap: true,
          removeUndefinedValues: true,
        }),
      ],
    });

    const result = await repository.findByUserId(validFlashcardSessionProps.userId);

      expect(result).toBeDefined();
      expect(result?.length).toBe(1);
    })

    it('should return an empty array if no study sessions are found', async () => {
      dynamoMock.on(QueryCommand).resolves({});

      const result = await repository.findByUserId(validFlashcardSessionProps.userId);

      expect(result).toEqual([]);
    })
  })
})