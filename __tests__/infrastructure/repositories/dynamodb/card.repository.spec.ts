import {
  BatchWriteItemCommand,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { beforeEach, describe, expect, it } from "vitest";
import { marshall } from "@aws-sdk/util-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

import { validCardProps } from "__tests__/@support/fixtures/card.fixtures";

import { Card } from "@/domain/entities/card";
import { CardDynamoRepository } from "@/infrastructure/repository/dynamodb/card.repository";

const dynamoMock = mockClient(new DynamoDBClient({}));

describe("CardDynamoRepository", () => {
  let repository: CardDynamoRepository;

  beforeEach(() => {
    dynamoMock.reset();
    repository = new CardDynamoRepository(
      dynamoMock as unknown as DynamoDBClient
    );
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  it("should be able to save a card", async () => {
    dynamoMock.on(PutItemCommand).resolves({});

    const card = new Card(validCardProps);

    await repository.save(card);

    expect(dynamoMock).toHaveReceivedCommandTimes(PutItemCommand, 1);
  });

  it("should be able to delete a card", async () => {
    dynamoMock.on(DeleteItemCommand).resolves({});

    await repository.deleteByIdAndDeckId(
      validCardProps.id,
      validCardProps.deckId
    );

    expect(dynamoMock).toHaveReceivedCommandTimes(DeleteItemCommand, 1);
  });

  it("should be able to delete multiple cards", async () => {
    dynamoMock.on(BatchWriteItemCommand).resolves({});

    await repository.deleteByIds([validCardProps.id]);

    expect(dynamoMock).toHaveReceivedCommandTimes(BatchWriteItemCommand, 1);
  });

  it("should be able to save multiple cards", async () => {
    dynamoMock.on(BatchWriteItemCommand).resolves({});

    await repository.saveBatch([new Card(validCardProps)]);

    expect(dynamoMock).toHaveReceivedCommandTimes(BatchWriteItemCommand, 1);
  });

  describe("findById", () => {
    it("should be able to find a card by id", async () => {
      dynamoMock.on(GetItemCommand).resolves({
        Item: marshall(validCardProps, {
          convertClassInstanceToMap: true,
          removeUndefinedValues: true,
        }),
      });

      const card = await repository.findByIdAndDeckId(
        validCardProps.id,
        validCardProps.deckId
      );

      expect(card).toBeDefined();
      expect(card?.id).toBe(validCardProps.id);
    });

    it("should return null if the card is not found", async () => {
      dynamoMock.on(GetItemCommand).resolves({});

      const card = await repository.findByIdAndDeckId(
        validCardProps.id,
        validCardProps.deckId
      );

      expect(card).toBeNull();
    });
  });

  describe("findByDeckId", () => {
    it("should be able to find all cards by deck id", async () => {
      dynamoMock.on(QueryCommand).resolves({
        Items: [
          marshall(validCardProps, {
            convertClassInstanceToMap: true,
            removeUndefinedValues: true,
          }),
        ],
      });

      const cards = await repository.findByDeckId(validCardProps.deckId);

      expect(cards).toBeDefined();
      expect(cards.length).toBe(1);
      expect(cards[0].id).toBe(validCardProps.id);
    });

    it("should return an empty array if no cards are found", async () => {
      dynamoMock.on(QueryCommand).resolves({});

      const cards = await repository.findByDeckId(validCardProps.deckId);

      expect(cards).toBeDefined();
      expect(cards.length).toBe(0);
    });
  });
});
