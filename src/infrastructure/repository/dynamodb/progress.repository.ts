import {
  BatchWriteItemCommand,
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

import { Progress } from "@/domain/entities/progress";
import { ProgressDynamoSchema } from "@/infrastructure/repository/dynamodb/schemas/progress.schema";
import { ProgressRepository } from "@/domain/interfaces/repositories";

export class ProgressDynamoRepository implements ProgressRepository {
  constructor(private readonly dynamoDbClient: DynamoDBClient) {}

  async findByCardAndDeck(
    cardId: string,
    deckId: string
  ): Promise<Progress | null> {
    const command = new QueryCommand({
      TableName: process.env.DECK_TABLE_NAME,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :gsi1pk AND GSI1SK = :gsi1sk",
      ExpressionAttributeValues: {
        ":gsi1pk": { S: ProgressDynamoSchema.buildGSI1PK(deckId) },
        ":gsi1sk": { S: ProgressDynamoSchema.buildGSI1SK(cardId) },
      },
    });

    const result = await this.dynamoDbClient.send(command);

    if (result.Items && result.Items.length > 0) {
      return ProgressDynamoSchema.fromDynamoItem(result.Items[0]);
    }

    return null;
  }

  async findDueCards(date: Date, deckId: string): Promise<Progress[]> {
    const command = new QueryCommand({
      TableName: process.env.DECK_TABLE_NAME,
      KeyConditionExpression: "PK = :pk and begins_with(SK, :sk)",
      FilterExpression: "nextReview <= :date",
      ExpressionAttributeValues: {
        ":pk": { S: ProgressDynamoSchema.buildPK(deckId) },
        ":sk": { S: "PROGRESS#" },
        ":date": { S: date.toISOString() },
      },
    });

    const result = await this.dynamoDbClient.send(command);

    return (
      result.Items?.map((item) => ProgressDynamoSchema.fromDynamoItem(item)) ??
      []
    );
  }

  async save(progress: Progress): Promise<void> {
    const progressDynamoSchema = new ProgressDynamoSchema(progress);
    const command = new PutItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Item: progressDynamoSchema.toMarshall(),
    });

    await this.dynamoDbClient.send(command);
  }

  async update(progress: Progress): Promise<void> {
    const progressDynamoSchema = new ProgressDynamoSchema(progress);

    await this.dynamoDbClient.send(
      new UpdateItemCommand({
        TableName: process.env.DECK_TABLE_NAME,
        Key: {
          PK: { S: ProgressDynamoSchema.buildPK(progress.deckId) },
          SK: { S: ProgressDynamoSchema.buildSK(progress.id) },
        },
        UpdateExpression:
          "set #nextReview = :nextReview, #interval = :interval, #repetitions = :repetitions, #easeFactor = :easeFactor, #lastReviewed = :lastReviewed, #updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":nextReview": progressDynamoSchema.toMarshall().nextReview,
          ":interval": progressDynamoSchema.toMarshall().interval,
          ":repetitions": progressDynamoSchema.toMarshall().repetitions,
          ":easeFactor": progressDynamoSchema.toMarshall().easeFactor,
          ":lastReviewed": progressDynamoSchema.toMarshall().lastReviewed,
          ":updatedAt": progressDynamoSchema.toMarshall().updatedAt,
        },
        ExpressionAttributeNames: {
          "#nextReview": "nextReview",
          "#interval": "interval",
          "#repetitions": "repetitions",
          "#easeFactor": "easeFactor",
          "#lastReviewed": "lastReviewed",
          "#updatedAt": "updatedAt",
        },
      })
    );
  }

  async deleteByIdAndDeckId(id: string, deckId: string): Promise<void> {
    await this.dynamoDbClient.send(
      new DeleteItemCommand({
        TableName: process.env.DECK_TABLE_NAME,
        Key: {
          PK: { S: ProgressDynamoSchema.buildPK(deckId) },
          SK: { S: ProgressDynamoSchema.buildSK(id) },
        },
      })
    );
  }

  async saveBatch(progresses: Progress[]): Promise<void> {
    const schema = progresses.map(
      (progress) => new ProgressDynamoSchema(progress)
    );

    const chunk = 25;

    for (let i = 0; i < schema.length; i += chunk) {
      const batch = schema.slice(i, i + chunk);

      const command = new BatchWriteItemCommand({
        RequestItems: {
          [process.env.DECK_TABLE_NAME]: batch.map((schema) => ({
            PutRequest: {
              Item: schema.toMarshall(),
            },
          })),
        },
      });

      await this.dynamoDbClient.send(command);
    }
  }

  async deleteByDeckId(deckId: string): Promise<void> {
    await this.dynamoDbClient.send(
      new DeleteItemCommand({
        TableName: process.env.DECK_TABLE_NAME,
        Key: { PK: { S: ProgressDynamoSchema.buildPK(deckId) } },
      })
    );
  }
}
