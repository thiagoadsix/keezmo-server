import { DeckRepository } from "@/domain/interfaces/repositories";
import { DynamoClient } from "./client";
import { Deck } from "@/domain/entities/deck";

export class DeckDynamoRepository implements DeckRepository {
  constructor(private readonly dynamoClient: DynamoClient) {
    this.dynamoClient = new DynamoClient();
  }

  findById(id: string): Promise<Deck | null> {
    throw new Error("Method not implemented.");
  }

  findByIdAndUserId(id: string, userId: string): Promise<Deck | null> {
    throw new Error("Method not implemented.");
  }

  findAllByUser(userId: string): Promise<Deck[]> {
    throw new Error("Method not implemented.");
  }

  save(deck: Deck): Promise<void> {
    throw new Error("Method not implemented.");
  }

  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

