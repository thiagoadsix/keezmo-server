import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { AttributeValue } from '@aws-sdk/client-dynamodb';

import { Deck } from "@/domain/entities/deck";
import { StudyMode, StudyModeEnum } from '@/domain/value-objects';

interface DeckDynamoItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  studyMode: StudyModeEnum;
  createdAt: string;
  updatedAt: string;
}

export class DeckDynamoSchema implements DeckDynamoItem {
  private readonly tableName: string;

  private PK: string;
  private SK: string;

  id: string;
  userId: string;
  title: string;
  description: string;
  studyMode: StudyModeEnum;
  createdAt: string;
  updatedAt: string;

  constructor(deck: Deck) {
    this.tableName = process.env.DECK_TABLE_NAME

    this.id = deck.id
    this.userId = deck.userId
    this.title = deck.title
    this.description = deck.description
    this.studyMode = deck.studyMode.getValue()
    this.createdAt = deck.createdAt
    this.updatedAt = deck.updatedAt

    this.PK = DeckDynamoSchema.buildPK(this.userId)
    this.SK = DeckDynamoSchema.buildSK(this.studyMode)
  }

  static buildPK(userId: string) {
    return `USER#${userId}`
  }

  static buildSK(studyMode: StudyModeEnum) {
    return `STUDY_MODE#${studyMode}`
  }

  toMarshall() {
    return marshall(this, {
      convertClassInstanceToMap: true,
      convertEmptyValues: true,
      removeUndefinedValues: true,
    })
  }

  static fromDynamoItem(item: Record<string, AttributeValue>): Deck {
    const deck = unmarshall(item)

    return new Deck({
      id: deck.id,
      userId: deck.userId,
      title: deck.title,
      description: deck.description,
      studyMode: new StudyMode(deck.studyMode),
      createdAt: deck.createdAt,
      updatedAt: deck.updatedAt,
    })
  }
}