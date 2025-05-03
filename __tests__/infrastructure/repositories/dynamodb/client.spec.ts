import { describe, expect, it } from "vitest";
import { DynamoClient } from "@/infrastructure/repository/dynamodb/client";

describe("DynamoClient", () => {
  it("should be able to create a new DynamoClient", () => {
    const dynamoClient = new DynamoClient();
    expect(dynamoClient).toBeDefined();
  });

  it("should be able to create a new DynamoClient with the correct region", async () => {
    const dynamoClient = new DynamoClient();
    const client = await dynamoClient.client();
    expect(await client.config.region()).toBe("us-east-1");
  });

  it("should be able to create a new DynamoClient with endpoint as undefined", async () => {
    const dynamoClient = new DynamoClient();
    const client = await dynamoClient.client();
    expect(client.config.endpoint).toBe(undefined);
  });

  it("should be able to create a new DynamoClient with endpoint as http://localhost:4566", async () => {
    process.env.IS_OFFLINE = "true";
    const dynamoClient = new DynamoClient();
    const client = await dynamoClient.client();
    const endpoint = await client.config.endpoint!();
    expect(endpoint.port).toBe(4566);
  });
});
