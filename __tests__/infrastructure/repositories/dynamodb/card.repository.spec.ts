import { describe, it, expect, beforeEach } from "vitest"
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
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
})