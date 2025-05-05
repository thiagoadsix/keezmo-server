import { ProgressDynamoRepository } from "@/infrastructure/repository/dynamodb/progress.repository";
import { dynamoClientRepositoryFactory } from "./client.repository.factory";

export const progressRepositoryFactory = () => {
  const client = dynamoClientRepositoryFactory();
  return new ProgressDynamoRepository(client);
};
