import { describe, it, expect } from "vitest";

import { StudySession } from "@/domain/entities/study-session";

import { StudySessionDynamoSchema } from "@/infrastructure/repository/dynamodb/schemas/study-session.schema";
import { validFlashcardSessionProps } from "__tests__/@support/fixtures/study-session.fixtures";

describe("StudySessionDynamoSchema", () => {
  it("should be able to create a study session dynamo schema", () => {
    const studySession = new StudySession(validFlashcardSessionProps);
    const studySessionDynamoSchema = new StudySessionDynamoSchema(studySession);

    expect(studySessionDynamoSchema).toBeDefined();
    expect(studySessionDynamoSchema.id).toBe(studySession.id);
    expect(studySessionDynamoSchema.deckId).toBe(studySession.deckId);
    expect(studySessionDynamoSchema.userId).toBe(studySession.userId);
    expect(studySessionDynamoSchema.startTime).toBe(studySession.startTime);
  });
});
