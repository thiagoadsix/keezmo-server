import { type Mock, vi } from "vitest";

import { ProgressRepository } from "@/domain/interfaces/repositories";

type MockProgressRepository = {
  [K in keyof ProgressRepository]: Mock;
};

export const mockProgressRepository: MockProgressRepository = {
  findByCardAndDeck: vi.fn(),
  findDueCards: vi.fn(),
  save: vi.fn(),
  update: vi.fn(),
  deleteById: vi.fn(),
  saveBatch: vi.fn(),
  deleteByDeckId: vi.fn(),
};
