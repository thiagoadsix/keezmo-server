import { StudySession } from "@/domain/entities/study-session"
import { StudyModeEnum } from "@/domain/value-objects"
import { StudyMode } from "@/domain/value-objects/study-mode"
import { AttributeValue } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

interface StudySessionDynamoItem {
  id: string
  deckId: string
  userId: string
  startTime: string
  endTime?: string | null
  studyMode: StudyModeEnum
  createdAt: string
  updatedAt: string
}

export class StudySessionDynamoSchema implements StudySessionDynamoItem {
  readonly PK: string
  readonly SK: string

  id: string
  deckId: string
  userId: string
  startTime: string
  endTime?: string | null
  studyMode: StudyModeEnum
  createdAt: string
  updatedAt: string

  constructor(studySession: StudySession) {
    this.id = studySession.id
    this.deckId = studySession.deckId
    this.userId = studySession.userId
    this.startTime = studySession.startTime
    this.endTime = studySession.endTime
    this.studyMode = studySession.studyMode
    this.createdAt = studySession.createdAt
    this.updatedAt = studySession.updatedAt

    this.PK = StudySessionDynamoSchema.buildPK(this.deckId)
    this.SK = StudySessionDynamoSchema.buildSK(this.id)
  }

  static buildPK(deckId: string) {
    return `DECK#${deckId}`
  }

  static buildSK(id: string) {
    return `STUDY_SESSION#${id}`
  }

  toMarshall() {
    return marshall(this, {
      convertClassInstanceToMap: true,
      convertEmptyValues: true,
      removeUndefinedValues: true,
    })
  }

  static fromDynamoItem(item: Record<string, AttributeValue>): StudySession {
    const studySession = unmarshall(item)

    return new StudySession({
      id: studySession.id,
      deckId: studySession.deckId,
      userId: studySession.userId,
      startTime: studySession.startTime,
      endTime: studySession.endTime,
      studyMode: studySession.studyMode,
      createdAt: studySession.createdAt,
      updatedAt: studySession.updatedAt,
    })
  }
}
