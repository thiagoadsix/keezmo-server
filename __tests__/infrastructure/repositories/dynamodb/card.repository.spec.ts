import { describe, it, expect, beforeEach } from "vitest"
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import { validCardProps } from "__tests__/@support/fixtures/card.fixtures";

import { CardDynamoRepository } from "@/infrastructure/repository/dynamodb/card.repository"
import { Card } from "@/domain/entities/card";

const dynamoMock = mockClient(new DynamoDBClient({}));

describe("CardDynamoRepository", () => {
  let repository: CardDynamoRepository

  beforeEach(() => {
    dynamoMock.reset();
    repository = new CardDynamoRepository(dynamoMock as any);
  })

  it("should be defined", () => {
    expect(repository).toBeDefined()
  })

  it("should be able to save a card", async () => {
    dynamoMock.on(PutItemCommand).resolves({})

    const card = new Card(validCardProps)

    await repository.save(card)

    expect(dynamoMock).toHaveReceivedCommandTimes(PutItemCommand, 1)
  })

  describe("findById", () => {
    it("should be able to find a card by id", async () => {
      dynamoMock.on(GetItemCommand).resolves({
        Item: marshall(validCardProps, {
          convertClassInstanceToMap: true,
          removeUndefinedValues: true,
        }),
      })

      const card = await repository.findById(validCardProps.id)

      expect(card).toBeDefined()
      expect(card?.id).toBe(validCardProps.id)
    })

    it("should return null if the card is not found", async () => {
      dynamoMock.on(GetItemCommand).resolves({})

      const card = await repository.findById(validCardProps.id)

      expect(card).toBeNull()
    })
  })

  describe("findByDeckId", () => {
    it("should be able to find all cards by deck id", async () => {
      dynamoMock.on(QueryCommand).resolves({
        Items: [
          marshall(validCardProps, {
            convertClassInstanceToMap: true,
            removeUndefinedValues: true,
          }),
        ],
      })

      const cards = await repository.findByDeckId(validCardProps.deckId)

      expect(cards).toBeDefined()
      expect(cards.length).toBe(1)
      expect(cards[0].id).toBe(validCardProps.id)
    })

    it("should return an empty array if no cards are found", async () => {
      dynamoMock.on(QueryCommand).resolves({})

      const cards = await repository.findByDeckId(validCardProps.deckId)

      expect(cards).toBeDefined()
      expect(cards.length).toBe(0)
    })
  })
})