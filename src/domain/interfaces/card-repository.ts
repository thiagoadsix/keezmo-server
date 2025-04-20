import { Card } from '@/domain/entities/card'

export interface CardRepository {
  findByDeckId(deckId: string): Promise<Card[]>
  deleteByIds(ids: string[]): Promise<void>
}
