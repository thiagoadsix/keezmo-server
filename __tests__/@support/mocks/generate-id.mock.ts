import { vi } from 'vitest'

export const mockId = '123e4567-e89b-12d3-a456-426614174000'

export const generateIdMock = vi.fn().mockReturnValue(mockId)

vi.mock('@/shared/utils/generate-id', () => ({
  generateId: generateIdMock,
}))
