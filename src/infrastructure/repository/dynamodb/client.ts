import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoClient {
  private init: DynamoDBClient;

  constructor() {
    this.init = new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-1",
      endpoint:
        process.env.IS_OFFLINE === "true" ? "http://localhost:4566" : undefined,
    });
  }

  public client(): DynamoDBClient {
    this.init = new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-1",
      endpoint:
        process.env.IS_OFFLINE === "true" ? "http://localhost:4566" : undefined,
    });

    return this.init;
  }
}
