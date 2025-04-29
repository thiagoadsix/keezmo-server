import { describe, it, expect } from "vitest";
import { DynamoClient } from "@/infrastructure/repository/dynamodb/client";

describe("DynamoClient", () => {
  it("should be able to create a new DynamoClient", () => {
    const dynamoClient = new DynamoClient();
    expect(dynamoClient).toBeDefined();
  });
});