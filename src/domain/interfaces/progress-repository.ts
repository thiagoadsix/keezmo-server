import { Progress } from '../entities/progress'

export interface ProgressRepository {
  findByCardAndDeck(cardId: string, deckId: string): Promise<Progress | null>
  findDueCards(date: Date, deckId?: string): Promise<Progress[]>
  save(progress: Progress): Promise<void>
  update(progress: Progress): Promise<void>
  deleteById(id: string): Promise<void>
  saveBatch(progresses: Progress[]): Promise<void>
  deleteByDeckId(deckId: string): Promise<void>
}
