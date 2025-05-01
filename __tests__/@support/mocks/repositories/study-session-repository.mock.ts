import { type Mock, vi } from 'vitest';

import { StudySessionRepository } from '@/domain/interfaces/repositories';

type MockStudySessionRepository = {
  [K in keyof StudySessionRepository]: Mock;
};

export const mockStudySessionRepository: MockStudySessionRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  save: vi.fn(),
};
