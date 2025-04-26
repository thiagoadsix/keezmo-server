import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { Card } from '@/domain/entities/card'
import { Progress } from '@/domain/entities/progress'
import { CardNotFoundError } from '@/domain/errors/card/card-not-found-error'
import { ProgressNotFoundError } from '@/domain/errors/progress/progress-not-found-error'
import { CardRepository } from '@/domain/interfaces/card-repository'
import { ProgressRepository } from '@/domain/interfaces/progress-repository'
import { SM2SchedulerService } from '@/domain/services/sm2-scheduler.service'
import { ReviewCardUseCase } from '@/domain/use-cases/progress/review-card.usecase'
import { DifficultyEnum } from '@/domain/value-objects'

// Mock SM2SchedulerService
vi.mock('@/domain/services/sm2-scheduler.service', () => ({
  SM2SchedulerService: {
    execute: vi.fn(),
  },
}))

describe('ReviewCardUseCase', () => {
  let progressRepository: ProgressRepository
  let cardRepository: CardRepository
  let sut: ReviewCardUseCase

  const mockCardId = 'card-123'
  const mockDeckId = 'deck-456'

  const mockCard = new Card({
    deckId: mockDeckId,
    question: 'Test question',
    answer: 'Test answer',
  })

  // Setup mockId property on card to match the expected cardId
  Object.defineProperty(mockCard, 'id', { value: mockCardId })

  const mockProgress = new Progress({
    cardId: mockCardId,
    deckId: mockDeckId,
    repetitions: 1,
    interval: 1,
    easeFactor: 2.5,
    nextReview: '2023-01-02T12:00:00Z',
    lastReviewed: '2023-01-01T12:00:00Z',
  })

  const mockUpdatedProgress = new Progress({
    cardId: mockCardId,
    deckId: mockDeckId,
    repetitions: 2,
    interval: 6,
    easeFactor: 2.6,
    nextReview: '2023-01-08T12:00:00.000Z',
    lastReviewed: '2023-01-02T12:00:00Z',
  })

  beforeEach(() => {
    // Mock repositories
    progressRepository = {
      findByCardAndDeck: vi.fn(),
      findDueCards: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      deleteById: vi.fn(),
    }

    cardRepository = {
      findById: vi.fn(),
      findByDeckId: vi.fn(),
      save: vi.fn(),
      deleteById: vi.fn(),
      deleteByIds: vi.fn(),
    }

    // Create SUT (System Under Test)
    sut = new ReviewCardUseCase(progressRepository, cardRepository)

    // Spy on console.log
    vi.spyOn(console, 'log').mockImplementation(() => {})

    // Setup SM2SchedulerService mock
    vi.mocked(SM2SchedulerService.execute).mockReturnValue({
      updated: mockUpdatedProgress,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should update progress using SM2 scheduler when reviewing a card', async () => {
    // Arrange
    vi.mocked(cardRepository.findById).mockResolvedValueOnce(mockCard)
    vi.mocked(progressRepository.findByCardAndDeck).mockResolvedValueOnce(
      mockProgress,
    )

    // Act
    const result = await sut.execute({
      cardId: mockCardId,
      deckId: mockDeckId,
      difficulty: DifficultyEnum.NORMAL,
    })

    // Assert
    expect(cardRepository.findById).toHaveBeenCalledWith(mockCardId)
    expect(progressRepository.findByCardAndDeck).toHaveBeenCalledWith(
      mockCardId,
      mockDeckId,
    )
    expect(SM2SchedulerService.execute).toHaveBeenCalledWith({
      progress: mockProgress,
      difficulty: DifficultyEnum.NORMAL,
    })
    expect(progressRepository.update).toHaveBeenCalledWith(mockUpdatedProgress)

    expect(result.progress).toBe(mockUpdatedProgress)
    expect(result.nextReview).toBeInstanceOf(Date)
    expect(result.nextReview.toISOString()).toBe(mockUpdatedProgress.nextReview)
  })

  it('should throw CardNotFoundError when card does not exist', async () => {
    // Arrange
    vi.mocked(cardRepository.findById).mockResolvedValueOnce(null)

    // Act & Assert
    await expect(
      sut.execute({
        cardId: mockCardId,
        deckId: mockDeckId,
        difficulty: DifficultyEnum.NORMAL,
      }),
    ).rejects.toThrow(CardNotFoundError)

    expect(progressRepository.findByCardAndDeck).not.toHaveBeenCalled()
    expect(SM2SchedulerService.execute).not.toHaveBeenCalled()
    expect(progressRepository.update).not.toHaveBeenCalled()
  })

  it('should throw ProgressNotFoundError when progress does not exist', async () => {
    // Arrange
    vi.mocked(cardRepository.findById).mockResolvedValueOnce(mockCard)
    vi.mocked(progressRepository.findByCardAndDeck).mockResolvedValueOnce(null)

    // Act & Assert
    await expect(
      sut.execute({
        cardId: mockCardId,
        deckId: mockDeckId,
        difficulty: DifficultyEnum.NORMAL,
      }),
    ).rejects.toThrow(ProgressNotFoundError)

    expect(SM2SchedulerService.execute).not.toHaveBeenCalled()
    expect(progressRepository.update).not.toHaveBeenCalled()
  })
})
