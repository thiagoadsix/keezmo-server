import { InvalidDeckTypeError } from '@/domain/errors/deck/invalid-deck-type-error'

export enum DeckTypeEnum {
  FLASHCARD = 'flashcard',
  MULTIPLE_CHOICE = 'multiple_choice',
}

export class DeckType {
  private readonly value: DeckTypeEnum

  constructor(type: string) {
    if (!this.isValidType(type)) {
      throw new InvalidDeckTypeError(type)
    }
    this.value = type as DeckTypeEnum
  }

  private isValidType(type: string): boolean {
    return Object.values(DeckTypeEnum).includes(type as DeckTypeEnum)
  }

  public getValue(): DeckTypeEnum {
    return this.value
  }
}
