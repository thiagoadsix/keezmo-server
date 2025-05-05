import { Card } from "@/domain/entities/card";
import { InvalidDeckDescriptionError } from "@/domain/errors/deck/invalid-deck-description-error";
import { InvalidDeckTitleError } from "@/domain/errors/deck/invalid-deck-title-error";
import { StudyMode } from "@/domain/value-objects";

import { generateId } from "@/shared/utils/generate-id";

interface DeckProps {
  id?: string | null;
  userId: string;
  title: string;
  description: string;
  studyMode: StudyMode;
  cards?: Card[];
  createdAt?: string;
  updatedAt?: string;
}

export class Deck {
  public readonly id: string;
  public readonly userId: string;
  public title: string;
  public description: string;
  public studyMode: StudyMode;
  public cards: Card[];
  public readonly createdAt: string;
  public updatedAt: string;

  constructor(props: DeckProps) {
    if (!this.isValidTitle(props.title)) {
      throw new InvalidDeckTitleError(props.title);
    }

    if (!this.isValidDescription(props.description)) {
      throw new InvalidDeckDescriptionError(props.description);
    }

    this.id = props.id ?? generateId();
    this.userId = props.userId;
    this.title = props.title;
    this.description = props.description;
    this.studyMode = props.studyMode;
    this.cards = props.cards || [];
    this.createdAt = props.createdAt || new Date().toISOString();
    this.updatedAt = props.updatedAt || this.createdAt;
  }

  private isValidTitle(title: string): boolean {
    return title.trim().length > 0;
  }

  private isValidDescription(description: string): boolean {
    return description !== null && description !== undefined;
  }

  public updateTitle(newTitle: string): void {
    if (!this.isValidTitle(newTitle)) {
      throw new InvalidDeckTitleError(newTitle);
    }

    this.title = newTitle;
    this.updatedAt = new Date().toISOString();
  }

  public updateDescription(newDescription: string): void {
    if (!this.isValidDescription(newDescription)) {
      throw new InvalidDeckDescriptionError(newDescription);
    }

    this.description = newDescription;
    this.updatedAt = new Date().toISOString();
  }

  public updateStudyMode(newStudyMode: StudyMode): void {
    this.studyMode = newStudyMode;
    this.updatedAt = new Date().toISOString();
  }

  public addCard(card: Card): void {
    this.cards.push(card);
    this.updatedAt = new Date().toISOString();
  }

  public addCards(cards: Card[]): void {
    this.cards.push(...cards);
    this.updatedAt = new Date().toISOString();
  }

  public removeCard(cardId: string): void {
    this.cards = this.cards.filter((card) => card.id !== cardId);
    this.updatedAt = new Date().toISOString();
  }

  public getCardById(cardId: string): Card | undefined {
    return this.cards.find((card) => card.id === cardId);
  }
}
