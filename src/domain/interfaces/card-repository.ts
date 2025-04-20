export interface CardRepository {
  deleteByIds(ids: string[]): Promise<void>
}
