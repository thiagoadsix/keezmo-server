import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";

import { StudyModeEnum } from "@/domain/value-objects";
import { StudySession } from "@/domain/entities/study-session";

interface StudySessionDynamoItem {
  id: string;
  deckId: string;
  userId: string;
  startTime: string;
  endTime?: string | null;
  studyMode: StudyModeEnum;
  createdAt: string;
  updatedAt: string;
}

export class StudySessionDynamoSchema implements StudySessionDynamoItem {
  readonly PK: string;
  readonly SK: string;

  readonly GSI1PK: string;
  readonly GSI1SK: string;

  readonly GSI2PK: string;
  readonly GSI2SK: string;

  id: string;
  deckId: string;
  userId: string;
  startTime: string;
  endTime?: string | null;
  studyMode: StudyModeEnum;
  createdAt: string;
  updatedAt: string;

  constructor(studySession: StudySession) {
    this.id = studySession.id;
    this.deckId = studySession.deckId;
    this.userId = studySession.userId;
    this.startTime = studySession.startTime;
    this.endTime = studySession.endTime;
    this.studyMode = studySession.studyMode;
    this.createdAt = studySession.createdAt;
    this.updatedAt = studySession.updatedAt;

    this.PK = StudySessionDynamoSchema.buildPK(this.deckId);
    this.SK = StudySessionDynamoSchema.buildSK(this.id);

    this.GSI1PK = StudySessionDynamoSchema.buildGSI1PK(this.userId);
    this.GSI1SK = StudySessionDynamoSchema.buildGSI1SK(this.studyMode);

    this.GSI2PK = StudySessionDynamoSchema.buildGSI2PK(this.id);
    this.GSI2SK = StudySessionDynamoSchema.buildGSI2SK(this.id);
  }

  static buildPK(deckId: string) {
    return `DECK#${deckId}`;
  }

  static buildSK(id: string) {
    return `STUDY_SESSION#${id}`;
  }

  static buildGSI1PK(userId: string) {
    return `USER#${userId}`;
  }

  static buildGSI1SK(studyMode: StudyModeEnum) {
    return `STUDY_MODE#${studyMode}`;
  }

  static buildGSI2PK(id: string) {
    return `STUDY_SESSION#${id}`;
  }

  static buildGSI2SK(id: string) {
    return `STUDY_SESSION#${id}`;
  }

  toMarshall() {
    return marshall(this, {
      convertClassInstanceToMap: true,
      convertEmptyValues: true,
      removeUndefinedValues: true,
    });
  }

  static fromDynamoItem(item: Record<string, AttributeValue>): StudySession {
    const studySession = unmarshall(item);

    return new StudySession({
      id: studySession.id,
      deckId: studySession.deckId,
      userId: studySession.userId,
      startTime: studySession.startTime,
      endTime: studySession.endTime,
      studyMode: studySession.studyMode,
      createdAt: studySession.createdAt,
      updatedAt: studySession.updatedAt,
    });
  }
}
