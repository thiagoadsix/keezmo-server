import { DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";

import { CardRepository } from "@/domain/interfaces/repositories";
import { Card } from "@/domain/entities/card";

import { CardDynamoSchema } from "./schemas/card.schema";

export class CardDynamoRepository implements CardRepository {
  constructor(private readonly client: DynamoDBClient) {}

  async findById(id: string): Promise<Card | null> {
    const command = new GetItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Key: { id: { S: id } },
    })

    const result = await this.client.send(command)

    if (result.Item) {
      return CardDynamoSchema.fromDynamoItem(result.Item)
    }

    return null
  }

  findByDeckId(deckId: string): Promise<Card[]> {
    throw new Error("Method not implemented.");
  }

  async save(card: Card): Promise<void> {
    const schema = new CardDynamoSchema(card)
    const command = new PutItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Item: schema.toMarshall(),
    })

    await this.client.send(command)
  }

  deleteById(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  deleteByIds(ids: string[]): Promise<void> {
    throw new Error("Method not implemented.");
  }

  saveBatch(cards: Card[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
}