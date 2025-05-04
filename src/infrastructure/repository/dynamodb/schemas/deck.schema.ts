import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";

import { StudyMode, StudyModeEnum } from "@/domain/value-objects";
import { Deck } from "@/domain/entities/deck";

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
  readonly PK: string;
  readonly SK: string;

  readonly GSI1PK: string;
  readonly GSI1SK: string;

  id: string;
  userId: string;
  title: string;
  description: string;
  studyMode: StudyModeEnum;
  createdAt: string;
  updatedAt: string;

  constructor(deck: Deck) {
    this.id = deck.id;
    this.userId = deck.userId;
    this.title = deck.title;
    this.description = deck.description;
    this.studyMode = deck.studyMode.getValue();
    this.createdAt = deck.createdAt;
    this.updatedAt = deck.updatedAt;

    this.PK = DeckDynamoSchema.buildPK(this.userId);
    this.SK = DeckDynamoSchema.buildSK(this.id);

    this.GSI1PK = DeckDynamoSchema.buildGSI1PK(this.id);
    this.GSI1SK = DeckDynamoSchema.buildGSI1SK(this.studyMode);
  }

  static buildPK(userId: string) {
    return `USER#${userId}`;
  }

  static buildSK(id: string) {
    return `DECK#${id}`;
  }

  static buildGSI1PK(userId: string) {
    return `USER#${userId}`;
  }

  static buildGSI1SK(studyMode: StudyModeEnum) {
    return `STUDY_MODE#${studyMode}`;
  }

  toMarshall() {
    return marshall(this, {
      convertClassInstanceToMap: true,
      convertEmptyValues: true,
      removeUndefinedValues: true,
    });
  }

  static fromDynamoItem(item: Record<string, AttributeValue>): Deck {
    const deck = unmarshall(item);

    return new Deck({
      id: deck.id,
      userId: deck.userId,
      title: deck.title,
      description: deck.description,
      studyMode: new StudyMode(deck.studyMode),
      createdAt: deck.createdAt,
      updatedAt: deck.updatedAt,
    });
  }
}
