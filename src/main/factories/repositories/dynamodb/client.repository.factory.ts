import { DynamoClient } from "@/infrastructure/repository/dynamodb/client";

export const dynamoClientRepositoryFactory = () => {
  return new DynamoClient().client();
};
