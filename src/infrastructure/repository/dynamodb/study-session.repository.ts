import { DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';

import { StudySession } from '@/domain/entities/study-session';
import { StudySessionRepository } from '@/domain/interfaces/repositories';

import { StudySessionDynamoSchema } from './schemas/study-session.schema';

export class StudySessionDynamoRepository implements StudySessionRepository {
  constructor(private readonly client: DynamoDBClient) {}

  async findById(id: string): Promise<StudySession | null> {
    const command = new GetItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Key: { id: { S: id } },
    });

    const result = await this.client.send(command);

    if (result.Item) {
      return StudySessionDynamoSchema.fromDynamoItem(result.Item);
    }

    return null;
  }

  async findByUserId(userId: string): Promise<StudySession[]> {
    const command = new QueryCommand({
      TableName: process.env.DECK_TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk',
      ExpressionAttributeValues: {
        ':gsi1pk': { S: StudySessionDynamoSchema.buildGSI1PK(userId) },
      },
    });

    const result = await this.client.send(command);

    if (result.Items) {
      return result.Items.map(item => StudySessionDynamoSchema.fromDynamoItem(item));
    }

    return [];
  }

  async save(studySession: StudySession): Promise<void> {
    const schema = new StudySessionDynamoSchema(studySession);
    const command = new PutItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Item: schema.toMarshall(),
    });

    await this.client.send(command);
  }
}
