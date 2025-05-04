import { type Mock, vi } from "vitest";

import type { CardRepository } from "@/domain/interfaces/repositories";

type MockCardRepository = {
  [K in keyof CardRepository]: Mock;
};

export const mockCardRepository: MockCardRepository = {
  findByDeckId: vi.fn(),
  findByIdAndDeckId: vi.fn(),
  save: vi.fn(),
  deleteByIdAndDeckId: vi.fn(),
  deleteByIds: vi.fn(),
  saveBatch: vi.fn(),
};
