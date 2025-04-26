import { Progress } from '../entities/progress'

export interface ProgressRepository {
  findByCardAndDeck(cardId: string, deckId: string): Promise<Progress | null>
  save(progress: Progress): Promise<void>
  update(progress: Progress): Promise<void>
  deleteById(id: string): Promise<void>
}
