import { vi } from 'vitest'

import { DeckRepository } from '@/domain/interfaces/deck-repository'

type MockedFunction<T> = T & {
  mock: { calls: any[][] }
  mockRejectedValueOnce: (value: Error) => void
}

type MockedRepository<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? MockedFunction<T[K]>
    : T[K]
}

export const mockDeckRepository: MockedRepository<DeckRepository> = {
  findById: vi.fn(),
  findAllByUser: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
}
