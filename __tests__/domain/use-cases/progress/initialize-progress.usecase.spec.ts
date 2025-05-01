import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InitializeProgressUseCase } from '@/domain/use-cases/progress/initialize-progress.usecase';
import { Progress } from '@/domain/entities/progress';

import { mockProgressRepository } from '../../../@support/mocks/repositories/progress-repository.mock';

describe('InitializeProgressUseCase', () => {
  let sut: InitializeProgressUseCase;
  const mockCardId = '123e4567-e89b-12d3-a456-426614174001';
  const mockDeckId = '123e4567-e89b-12d3-a456-426614174002';

  beforeEach(() => {
    sut = new InitializeProgressUseCase(mockProgressRepository);
  });

  it('should return existing progress when it already exists', async () => {
    const existingProgress = new Progress({
      cardId: mockCardId,
      deckId: mockDeckId,
      repetitions: 2,
      interval: 5,
      easeFactor: 2.2,
    });

    vi.mocked(mockProgressRepository.findByCardAndDeck).mockResolvedValueOnce(existingProgress);

    const result = await sut.execute({
      cardId: mockCardId,
      deckId: mockDeckId,
    });

    expect(mockProgressRepository.findByCardAndDeck).toHaveBeenCalledWith(mockCardId, mockDeckId);
    expect(mockProgressRepository.save).not.toHaveBeenCalled();
    expect(result.progress).toBe(existingProgress);
    expect(result.isNew).toBe(false);
  });

  it('should create and save new progress when none exists', async () => {
    vi.mocked(mockProgressRepository.findByCardAndDeck).mockResolvedValueOnce(null);

    const result = await sut.execute({
      cardId: mockCardId,
      deckId: mockDeckId,
    });

    expect(mockProgressRepository.findByCardAndDeck).toHaveBeenCalledWith(mockCardId, mockDeckId);
    expect(mockProgressRepository.save).toHaveBeenCalledWith(expect.any(Progress));
    expect(result.progress).toBeInstanceOf(Progress);
    expect(result.progress.cardId).toBe(mockCardId);
    expect(result.progress.deckId).toBe(mockDeckId);
    expect(result.progress.repetitions).toBe(0);
    expect(result.progress.interval).toBe(0);
    expect(result.progress.easeFactor).toBe(2.5);
    expect(result.isNew).toBe(true);
  });
});
