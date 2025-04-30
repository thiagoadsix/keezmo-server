import { describe, it, expect, beforeEach } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { ProgressDynamoRepository } from "@/infrastructure/repository/dynamodb/progress.repository";
import { Progress } from "@/domain/entities/progress";
import { validProgressProps } from "__tests__/@support/fixtures/progress.fixtures";

const dynamoMock = mockClient(new DynamoDBClient({}));

describe("ProgressDynamoRepository", () => {
  let repository: ProgressDynamoRepository;

  beforeEach(() => {
    dynamoMock.reset();
    repository = new ProgressDynamoRepository(dynamoMock as any);
  });

  it('should be able to save a progress', async () => {
    const progress = new Progress(validProgressProps)

    await repository.save(progress)

    expect(dynamoMock.calls()).toHaveLength(1)
  })
})