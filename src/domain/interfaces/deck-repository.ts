import { Deck } from '@/domain/entities/deck'

export interface DeckRepository {
  findById(id: string): Promise<Deck | null>
  findAll(): Promise<Deck[]>
  save(deck: Deck): Promise<void>
  delete(id: string): Promise<void>
}
