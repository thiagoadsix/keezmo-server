import { vi } from 'vitest'

import { ProgressRepository } from '@/domain/interfaces/progress-repository'

type MockedFunction<T> = T & {
  mock: { calls: any[][] }
  mockRejectedValueOnce: (value: Error) => void
  mockResolvedValue: (value: any) => void
  mockResolvedValueOnce: (value: any) => void
}

type MockedRepository<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? MockedFunction<T[K]>
    : T[K]
}

export const mockProgressRepository: MockedRepository<ProgressRepository> = {
  findByCardAndDeck: vi.fn(),
  findDueCards: vi.fn(),
  save: vi.fn(),
  update: vi.fn(),
  deleteById: vi.fn(),
  saveBatch: vi.fn(),
  deleteByDeckId: vi.fn(),
}