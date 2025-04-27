import { vi } from 'vitest'

import { StudySessionRepository } from '@/domain/interfaces/repositories'

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

export const mockStudySessionRepository: MockedRepository<StudySessionRepository> = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  save: vi.fn(),
}
