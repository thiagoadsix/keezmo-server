import { DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";

import { DeckRepository } from "@/domain/interfaces/repositories";
import { Deck } from "@/domain/entities/deck";

import { DeckDynamoSchema } from "./schemas/deck.schema";

export class DeckDynamoRepository implements DeckRepository {
  constructor(private readonly client: DynamoDBClient) {}

  async findById(id: string): Promise<Deck | null> {
    const command = new GetItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Key: { id: { S: id } },
    })

    const result = await this.client.send(command)

    if (result.Item) {
      return DeckDynamoSchema.fromDynamoItem(result.Item)
    }

    return null
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Deck | null> {
    const command = new GetItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Key: { id: { S: id }, userId: { S: userId } },
    })

    const result = await this.client.send(command)

    if (result.Item) {
      return DeckDynamoSchema.fromDynamoItem(result.Item)
    }

    return null
  }

  async findAllByUser(userId: string): Promise<Deck[]> {
    const command = new QueryCommand({
      TableName: process.env.DECK_TABLE_NAME,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": { S: DeckDynamoSchema.buildPK(userId) },
      },
    })

    const result = await this.client.send(command)

    if (result.Items && result.Items.length > 0) {
      return result.Items.map(item => DeckDynamoSchema.fromDynamoItem(item))
    }

    return []
  }

  async save(deck: Deck): Promise<void> {
    const schema = new DeckDynamoSchema(deck)
    const command = new PutItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Item: schema.toMarshall(),
    })

    await this.client.send(command)
  }

  async delete(id: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Key: { id: { S: id } },
    })

    await this.client.send(command)
  }
}

