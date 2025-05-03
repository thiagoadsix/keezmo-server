import { StudySessionDynamoRepository } from "@/infrastructure/repository/dynamodb/study-session.repository";

import { dynamoClientRepositoryFactory } from "./client.repository.factory";

export const studySessionRepositoryFactory = () => {
  const client = dynamoClientRepositoryFactory();
  return new StudySessionDynamoRepository(client);
};
