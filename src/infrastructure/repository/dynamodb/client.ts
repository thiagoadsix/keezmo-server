import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoClient {
  private readonly client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-1",
      endpoint: process.env.ENVIRONMENT === "local" ? "http://localhost:8000" : undefined,
    });
  }
}

