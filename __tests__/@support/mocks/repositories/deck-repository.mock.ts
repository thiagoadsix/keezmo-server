import { vi } from 'vitest'

import { DeckRepository } from '@/domain/interfaces/repositories'

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

export const mockDeckRepository: MockedRepository<DeckRepository> = {
  findById: vi.fn(),
  findByIdAndUserId: vi.fn(),
  findAllByUser: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
}
