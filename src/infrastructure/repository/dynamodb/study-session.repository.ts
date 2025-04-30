import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";

import { StudySessionRepository } from "@/domain/interfaces/repositories";
import { StudySession } from "@/domain/entities/study-session";

import { StudySessionDynamoSchema } from "./schemas/study-session.schema";

export class StudySessionDynamoRepository implements StudySessionRepository {
  constructor(private readonly client: DynamoDBClient) {}

  async findById(id: string): Promise<StudySession | null> {
    const command = new GetItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Key: { id: { S: id } },
    })

    const result = await this.client.send(command)

    if (result.Item) {
      return StudySessionDynamoSchema.fromDynamoItem(result.Item)
    }

    return null
  }

  findByUserId(userId: string): Promise<StudySession[]> {
    throw new Error("Method not implemented.");
  }

  async save(studySession: StudySession): Promise<void> {
    const schema = new StudySessionDynamoSchema(studySession)
    const command = new PutItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Item: schema.toMarshall(),
    })

    await this.client.send(command)
  }
}