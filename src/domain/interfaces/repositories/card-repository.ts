import { Card } from '@/domain/entities/card';

export interface CardRepository {
  findById(id: string): Promise<Card | null>;
  findByDeckId(deckId: string): Promise<Card[]>;
  save(card: Card): Promise<void>;
  deleteById(id: string): Promise<void>;
  deleteByIds(ids: string[]): Promise<void>;
  saveBatch(cards: Card[]): Promise<void>;
}
