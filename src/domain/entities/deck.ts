import { InvalidDeckDescriptionError } from '@/domain/errors/invalid-deck-description-error'
import { InvalidDeckTitleError } from '@/domain/errors/invalid-deck-title-error'
import { DeckType } from '@/domain/value-objects/deck-type'

import { generateId } from '@/shared/utils/generate-id'

interface DeckProps {
  title: string
  description: string
  type: DeckType
  createdAt?: string
  updatedAt?: string
}

export class Deck {
  public readonly id: string
  public title: string
  public description: string
  public type: DeckType
  public readonly createdAt: string
  public updatedAt: string

  constructor(props: DeckProps) {
    if (!this.isValidTitle(props.title)) {
      throw new InvalidDeckTitleError(props.title)
    }

    if (!this.isValidDescription(props.description)) {
      throw new InvalidDeckDescriptionError(props.description)
    }

    this.id = generateId()
    this.title = props.title
    this.description = props.description
    this.type = props.type
    this.createdAt = props.createdAt || new Date().toISOString()
    this.updatedAt = props.updatedAt || this.createdAt
  }

  private isValidTitle(title: string): boolean {
    return title.trim().length > 0
  }

  private isValidDescription(description: string): boolean {
    return description !== null && description !== undefined
  }

  public updateTitle(newTitle: string): void {
    if (!this.isValidTitle(newTitle)) {
      throw new InvalidDeckTitleError(newTitle)
    }

    this.title = newTitle
    this.updatedAt = new Date().toISOString()
  }

  public updateDescription(newDescription: string): void {
    if (!this.isValidDescription(newDescription)) {
      throw new InvalidDeckDescriptionError(newDescription)
    }

    this.description = newDescription
    this.updatedAt = new Date().toISOString()
  }

  public updateType(newType: DeckType): void {
    this.type = newType
    this.updatedAt = new Date().toISOString()
  }
}
