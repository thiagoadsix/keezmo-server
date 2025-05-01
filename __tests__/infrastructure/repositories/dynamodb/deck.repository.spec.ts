import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { beforeEach, describe, expect, it } from 'vitest';
import { marshall } from '@aws-sdk/util-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import { validDeckProps } from '__tests__/@support/fixtures/deck.fixtures';

import { Deck } from '@/domain/entities/deck';
import { DeckDynamoRepository } from '@/infrastructure/repository/dynamodb/deck.repository';

const dynamoMock = mockClient(new DynamoDBClient({}));

describe('DeckDynamoRepository', () => {
  let repository: DeckDynamoRepository;

  beforeEach(() => {
    dynamoMock.reset();
    repository = new DeckDynamoRepository(dynamoMock as unknown as DynamoDBClient);
  });

  describe('findById', () => {
    it('should be able to find a deck by id', async () => {
      const mockDeckData = {
        ...validDeckProps,
        studyMode: validDeckProps.studyMode.getValue(),
      };

      dynamoMock.on(GetItemCommand).resolves({
        Item: marshall(mockDeckData, {
          convertClassInstanceToMap: true,
          removeUndefinedValues: true,
        }),
      });

      const deck = await repository.findById(validDeckProps.id);

      expect(deck).toBeDefined();
      expect(deck?.id).toBe(validDeckProps.id);
      expect(deck?.studyMode.getValue()).toBe(validDeckProps.studyMode.getValue());
    });

    it('should return null if the deck is not found', async () => {
      dynamoMock.on(GetItemCommand).resolves({});

      const deck = await repository.findById(validDeckProps.id);

      expect(deck).toBeNull();
    });
  });

  describe('findByIdAndUserId', () => {
    it('should be able to find a deck by id and user id', async () => {
      const mockDeckData = {
        ...validDeckProps,
        studyMode: validDeckProps.studyMode.getValue(),
      };

      dynamoMock.on(GetItemCommand).resolves({
        Item: marshall(mockDeckData, {
          convertClassInstanceToMap: true,
          removeUndefinedValues: true,
        }),
      });

      const deck = await repository.findByIdAndUserId(validDeckProps.id, validDeckProps.userId);

      expect(deck).toBeDefined();
      expect(deck?.id).toBe(validDeckProps.id);
      expect(deck?.studyMode.getValue()).toBe(validDeckProps.studyMode.getValue());
    });

    it('should return null if the deck is not found', async () => {
      dynamoMock.on(GetItemCommand).resolves({});

      const deck = await repository.findByIdAndUserId(validDeckProps.id, validDeckProps.userId);

      expect(deck).toBeNull();
    });
  });

  describe('findAllByUser', () => {
    it('should be able to find all decks by user id', async () => {
      const mockDeckData = {
        ...validDeckProps,
        studyMode: validDeckProps.studyMode.getValue(),
      };

      dynamoMock.on(QueryCommand).resolves({
        Items: [
          marshall(mockDeckData, {
            convertClassInstanceToMap: true,
            removeUndefinedValues: true,
          }),
        ],
      });

      const decks = await repository.findAllByUser(validDeckProps.userId);

      expect(decks).toBeDefined();
      expect(decks.length).toBe(1);
      expect(decks[0].id).toBe(validDeckProps.id);
      expect(decks[0].studyMode.getValue()).toBe(validDeckProps.studyMode.getValue());
    });

    it('should return an empty array if no decks are found', async () => {
      dynamoMock.on(QueryCommand).resolves({
        Items: [],
      });

      const decks = await repository.findAllByUser(validDeckProps.userId);

      expect(decks).toBeDefined();
      expect(decks.length).toBe(0);
    });
  });

  it('should be able to save a deck', async () => {
    dynamoMock.on(PutItemCommand).resolves({});
    const deck = new Deck({ ...validDeckProps });

    await repository.save(deck);

    expect(dynamoMock).toHaveReceivedCommandTimes(PutItemCommand, 1);
  });

  it('should be able to delete a deck', async () => {
    dynamoMock.on(DeleteItemCommand).resolves({});

    await repository.delete(validDeckProps.id);

    expect(dynamoMock).toHaveReceivedCommandTimes(DeleteItemCommand, 1);
  });
});
