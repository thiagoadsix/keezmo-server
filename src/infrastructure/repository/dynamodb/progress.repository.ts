import { DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";

import { Progress } from "@/domain/entities/progress";
import { ProgressRepository } from "@/domain/interfaces/repositories";

import { ProgressDynamoSchema } from "@/infrastructure/repository/dynamodb/schemas/progress.schema"

export class ProgressDynamoRepository implements ProgressRepository {
  constructor(private readonly dynamoDbClient: DynamoDBClient) {}

  async findByCardAndDeck(cardId: string, deckId: string): Promise<Progress | null> {
    const command = new GetItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Key: {
        PK: { S: ProgressDynamoSchema.buildPK(deckId) },
        SK: { S: ProgressDynamoSchema.buildSK(cardId) },
      },
    })

    const result = await this.dynamoDbClient.send(command)

    if (result.Item) {
      return ProgressDynamoSchema.fromDynamoItem(result.Item)
    }

    return null
  }

  async findDueCards(date: Date, deckId?: string): Promise<Progress[]> {
    throw new Error("Method not implemented.");
  }

  async save(progress: Progress): Promise<void> {
    const progressDynamoSchema = new ProgressDynamoSchema(progress)

    await this.dynamoDbClient.send(new PutItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Item: progressDynamoSchema.toMarshall(),
    }))
  }

  async update(progress: Progress): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async deleteById(id: string): Promise<void> {
    await this.dynamoDbClient.send(new DeleteItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Key: { id: { S: id } },
    }))
  }

  async saveBatch(progresses: Progress[]): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async deleteByDeckId(deckId: string): Promise<void> {
    await this.dynamoDbClient.send(new DeleteItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Key: { PK: { S: ProgressDynamoSchema.buildPK(deckId) } },
    }))
  }
}
