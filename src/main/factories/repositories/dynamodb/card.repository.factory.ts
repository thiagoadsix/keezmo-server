import { CardDynamoRepository } from "@/infrastructure/repository/dynamodb/card.repository";
import { dynamoClientRepositoryFactory } from "./client.repository.factory";

export const cardRepositoryFactory = () => {
  const client = dynamoClientRepositoryFactory();
  return new CardDynamoRepository(client);
};
