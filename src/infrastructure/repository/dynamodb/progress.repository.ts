import {
  BatchWriteItemCommand,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';

import { Progress } from '@/domain/entities/progress';
import { ProgressDynamoSchema } from '@/infrastructure/repository/dynamodb/schemas/progress.schema';
import { ProgressRepository } from '@/domain/interfaces/repositories';

export class ProgressDynamoRepository implements ProgressRepository {
  constructor(private readonly dynamoDbClient: DynamoDBClient) {}

  async findByCardAndDeck(cardId: string, deckId: string): Promise<Progress | null> {
    const command = new GetItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Key: {
        PK: { S: ProgressDynamoSchema.buildPK(deckId) },
        SK: { S: ProgressDynamoSchema.buildSK(cardId) },
      },
    });

    const result = await this.dynamoDbClient.send(command);

    if (result.Item) {
      return ProgressDynamoSchema.fromDynamoItem(result.Item);
    }

    return null;
  }

  async findDueCards(date: Date, deckId?: string): Promise<Progress[]> {
    const command = new QueryCommand({
      TableName: process.env.DECK_TABLE_NAME,
      KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
      FilterExpression: 'nextReview <= :date',
      ExpressionAttributeValues: {
        ':pk': { S: deckId ? `DECK#${deckId}` : 'DECK' },
        ':sk': { S: 'CARD#' },
        ':date': { S: date.toISOString() },
      },
    });

    const result = await this.dynamoDbClient.send(command);

    return result.Items?.map(item => ProgressDynamoSchema.fromDynamoItem(item)) ?? [];
  }

  async save(progress: Progress): Promise<void> {
    const progressDynamoSchema = new ProgressDynamoSchema(progress);

    await this.dynamoDbClient.send(
      new PutItemCommand({
        TableName: process.env.DECK_TABLE_NAME,
        Item: progressDynamoSchema.toMarshall(),
      })
    );
  }

  async update(progress: Progress): Promise<void> {
    const progressDynamoSchema = new ProgressDynamoSchema(progress);

    await this.dynamoDbClient.send(
      new UpdateItemCommand({
        TableName: process.env.DECK_TABLE_NAME,
        Key: {
          PK: { S: ProgressDynamoSchema.buildPK(progress.deckId) },
          SK: { S: ProgressDynamoSchema.buildSK(progress.cardId) },
        },
        UpdateExpression:
          'set #nextReview = :nextReview, #interval = :interval, #repetitions = :repetitions, #easeFactor = :easeFactor, #lastReviewed = :lastReviewed, #updatedAt = :updatedAt',
        ExpressionAttributeValues: progressDynamoSchema.toMarshall(),
        ExpressionAttributeNames: {
          '#nextReview': 'nextReview',
          '#interval': 'interval',
          '#repetitions': 'repetitions',
          '#easeFactor': 'easeFactor',
          '#lastReviewed': 'lastReviewed',
          '#updatedAt': 'updatedAt',
        },
      })
    );
  }

  async deleteById(id: string): Promise<void> {
    await this.dynamoDbClient.send(
      new DeleteItemCommand({
        TableName: process.env.DECK_TABLE_NAME,
        Key: { id: { S: id } },
      })
    );
  }

  async saveBatch(progresses: Progress[]): Promise<void> {
    const schema = progresses.map(progress => new ProgressDynamoSchema(progress));

    const chunk = 25;

    for (let i = 0; i < schema.length; i += chunk) {
      const batch = schema.slice(i, i + chunk);

      const command = new BatchWriteItemCommand({
        RequestItems: {
          [process.env.DECK_TABLE_NAME]: batch.map(schema => schema.toMarshall()),
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
