import { describe, expect, it, vi, beforeEach } from 'vitest'

import { Progress } from '@/domain/entities/progress'
import { ProgressRepository } from '@/domain/interfaces/progress-repository'
import { InitializeProgressUseCase } from '@/domain/use-cases/progress/initialize-progress.usecase'

describe('InitializeProgressUseCase', () => {
  let progressRepository: ProgressRepository
  let sut: InitializeProgressUseCase
  const mockCardId = '123e4567-e89b-12d3-a456-426614174001'
  const mockDeckId = '123e4567-e89b-12d3-a456-426614174002'

  beforeEach(() => {
    progressRepository = {
      findByCardAndDeck: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      deleteById: vi.fn(),
    }

    sut = new InitializeProgressUseCase(progressRepository)

    // Spy on console.log to prevent output during tests
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('should return existing progress when it already exists', async () => {
    // Arrange
    const existingProgress = new Progress({
      cardId: mockCardId,
      deckId: mockDeckId,
      repetitions: 2,
      interval: 5,
      easeFactor: 2.2,
    })

    vi.mocked(progressRepository.findByCardAndDeck).mockResolvedValueOnce(
      existingProgress,
    )

    // Act
    const result = await sut.execute({
      cardId: mockCardId,
      deckId: mockDeckId,
    })

    // Assert
    expect(progressRepository.findByCardAndDeck).toHaveBeenCalledWith(
      mockCardId,
      mockDeckId,
    )
    expect(progressRepository.save).not.toHaveBeenCalled()
    expect(result.progress).toBe(existingProgress)
    expect(result.isNew).toBe(false)
  })

  it('should create and save new progress when none exists', async () => {
    // Arrange
    vi.mocked(progressRepository.findByCardAndDeck).mockResolvedValueOnce(null)

    // Act
    const result = await sut.execute({
      cardId: mockCardId,
      deckId: mockDeckId,
    })

    // Assert
    expect(progressRepository.findByCardAndDeck).toHaveBeenCalledWith(
      mockCardId,
      mockDeckId,
    )
    expect(progressRepository.save).toHaveBeenCalledWith(expect.any(Progress))
    expect(result.progress).toBeInstanceOf(Progress)
    expect(result.progress.cardId).toBe(mockCardId)
    expect(result.progress.deckId).toBe(mockDeckId)
    expect(result.progress.repetitions).toBe(0)
    expect(result.progress.interval).toBe(0)
    expect(result.progress.easeFactor).toBe(2.5)
    expect(result.isNew).toBe(true)
  })
})
