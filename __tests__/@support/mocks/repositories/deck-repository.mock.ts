import { type Mock, vi } from "vitest";

import { DeckRepository } from "@/domain/interfaces/repositories";

type MockDeckRepository = {
  [K in keyof DeckRepository]: Mock;
};

export const mockDeckRepository: MockDeckRepository = {
  findById: vi.fn(),
  findByIdAndUserId: vi.fn(),
  findAllByUser: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
};
