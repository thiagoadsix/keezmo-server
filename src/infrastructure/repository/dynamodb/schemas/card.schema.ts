import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";

import { Card } from "@/domain/entities/card";

interface CardDynamoItem {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export class CardDynamoSchema implements CardDynamoItem {
  readonly PK: string;
  readonly SK: string;

  id: string;
  deckId: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;

  constructor(card: Card) {
    this.id = card.id
    this.deckId = card.deckId
    this.question = card.question
    this.answer = card.answer
    this.createdAt = card.createdAt
    this.updatedAt = card.updatedAt

    this.PK = CardDynamoSchema.buildPK(this.deckId)
    this.SK = CardDynamoSchema.buildSK(this.id)
  }

  static buildPK(deckId: string) {
    return `DECK#${deckId}`
  }

  static buildSK(id: string) {
    return `CARD#${id}`
  }

  toMarshall() {
    return marshall(this, {
      convertClassInstanceToMap: true,
      convertEmptyValues: true,
      removeUndefinedValues: true,
    })
  }

  static fromDynamoItem(item: Record<string, AttributeValue>): Card {
    const card = unmarshall(item)

    return new Card({
      id: card.id,
      deckId: card.deckId,
      question: card.question,
      answer: card.answer,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    })
  }
}