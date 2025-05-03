import { Deck } from '@/domain/entities/deck';

export interface DeckRepository {
  findById(id: string): Promise<Deck | null>;
  findByIdAndUserId(id: string, userId: string): Promise<Deck | null>;
  findAllByUser(userId: string): Promise<Deck[]>;
  save(deck: Deck): Promise<void>;
  delete(id: string): Promise<void>;
}
