import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoClient {
  private  init: DynamoDBClient;

  constructor() {
    this.init = new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-1",
      endpoint: process.env.ENVIRONMENT === "local" ? "http://localhost:8000" : undefined,
    });
  }

  public async client(): Promise<DynamoDBClient> {
    this.init = new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-1",
      endpoint: process.env.ENVIRONMENT === "local" ? "http://localhost:8000" : undefined,
    });

    return this.init;
  }
}

