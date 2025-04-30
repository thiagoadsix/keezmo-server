import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { Progress } from "@/domain/entities/progress";
import { ProgressRepository } from "@/domain/interfaces/repositories";

import { ProgressDynamoSchema } from "@/infrastructure/repository/dynamodb/schemas/progress.schema"

export class ProgressDynamoRepository implements ProgressRepository {
  constructor(private readonly dynamoDbClient: DynamoDBClient) {}

  async findByCardAndDeck(cardId: string, deckId: string): Promise<Progress | null> {
    throw new Error("Method not implemented.");
  }

  async findDueCards(date: Date, deckId?: string): Promise<Progress[]> {
    throw new Error("Method not implemented.");
  }

  async save(progress: Progress): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async update(progress: Progress): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async deleteById(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async saveBatch(progresses: Progress[]): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async deleteByDeckId(deckId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
