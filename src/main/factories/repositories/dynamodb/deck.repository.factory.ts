import { DeckDynamoRepository } from "@/infrastructure/repository/dynamodb/deck.repository";
import { dynamoClientRepositoryFactory } from "./client.repository.factory";

export const deckRepositoryFactory = () => {
  const client = dynamoClientRepositoryFactory();
  return new DeckDynamoRepository(client);
};
