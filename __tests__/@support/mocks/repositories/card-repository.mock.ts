import { vi } from 'vitest'

import { CardRepository } from '@/domain/interfaces/repositories'

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

export const mockCardRepository: MockedRepository<CardRepository> = {
  findByDeckId: vi.fn(),
  findById: vi.fn(),
  save: vi.fn(),
  deleteById: vi.fn(),
  deleteByIds: vi.fn(),
  saveBatch: vi.fn(),
}