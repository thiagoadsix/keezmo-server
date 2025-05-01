import { type Mock, vi } from 'vitest';
import type { CardRepository } from '@/domain/interfaces/repositories';

type MockCardRepository = {
  [K in keyof CardRepository]: Mock;
};

export const mockCardRepository: MockCardRepository = {
  findByDeckId: vi.fn(),
  findById: vi.fn(),
  save: vi.fn(),
  deleteById: vi.fn(),
  deleteByIds: vi.fn(),
  saveBatch: vi.fn(),
};
