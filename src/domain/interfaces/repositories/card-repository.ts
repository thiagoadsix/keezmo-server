import { Card } from "@/domain/entities/card";

export interface CardRepository {
  findByIdAndDeckId(id: string, deckId: string): Promise<Card | null>;
  findByDeckId(deckId: string): Promise<Card[]>;
  save(card: Card): Promise<void>;
  deleteByIdAndDeckId(id: string, deckId: string): Promise<void>;
  deleteByIds(ids: string[]): Promise<void>;
  saveBatch(cards: Card[]): Promise<void>;
}
