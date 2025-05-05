import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { beforeEach, describe, expect, it } from "vitest";
import { marshall } from "@aws-sdk/util-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

import { StudySession } from "@/domain/entities/study-session";
import { StudySessionDynamoRepository } from "@/infrastructure/repository/dynamodb/study-session.repository";

import { validFlashcardSessionProps } from "__tests__/@support/fixtures/study-session.fixtures";

const dynamoMock = mockClient(new DynamoDBClient({}));

describe("StudySessionDynamoRepository", () => {
  let repository: StudySessionDynamoRepository;

  beforeEach(() => {
    dynamoMock.reset();
    repository = new StudySessionDynamoRepository(
      dynamoMock as unknown as DynamoDBClient
    );
  });

  it("should be able to save a study session", async () => {
    const studySession = new StudySession(validFlashcardSessionProps);

    await repository.save(studySession);

    expect(dynamoMock.calls()).toHaveLength(1);
  });

  describe("findById", () => {
    it("should be able to find a study session by id", async () => {
      dynamoMock.on(QueryCommand).resolves({
        Items: [
          marshall(validFlashcardSessionProps, {
            convertClassInstanceToMap: true,
            removeUndefinedValues: true,
          }),
        ],
      });

      const result = await repository.findById(validFlashcardSessionProps.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(validFlashcardSessionProps.id);
      expect(result?.deckId).toBe(validFlashcardSessionProps.deckId);
    });

    it("should return null if the study session is not found", async () => {
      dynamoMock.on(QueryCommand).resolves({});

      const result = await repository.findById(validFlashcardSessionProps.id);

      expect(result).toBeNull();
    });
  });

  describe("findByUserId", () => {
    it("should be able to find a study session by user id", async () => {
      dynamoMock.on(QueryCommand).resolves({
        Items: [
          marshall(validFlashcardSessionProps, {
            convertClassInstanceToMap: true,
            removeUndefinedValues: true,
          }),
        ],
      });

      const result = await repository.findByUserId(
        validFlashcardSessionProps.userId
      );

      expect(result).toBeDefined();
      expect(result?.length).toBe(1);
    });

    it("should return an empty array if no study sessions are found", async () => {
      dynamoMock.on(QueryCommand).resolves({});

      const result = await repository.findByUserId(
        validFlashcardSessionProps.userId
      );

      expect(result).toEqual([]);
    });
  });
});
