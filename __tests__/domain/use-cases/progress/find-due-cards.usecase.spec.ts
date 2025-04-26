import { describe, expect, it, vi, beforeEach } from 'vitest'

import { Card } from '@/domain/entities/card'
import { Progress } from '@/domain/entities/progress'
import { CardRepository } from '@/domain/interfaces/card-repository'
import { ProgressRepository } from '@/domain/interfaces/progress-repository'
import { FindDueCardsUseCase } from '@/domain/use-cases/progress/find-due-cards.usecase'

describe('FindDueCardsUseCase', () => {
  let progressRepository: ProgressRepository
  let cardRepository: CardRepository
  let sut: FindDueCardsUseCase
  const today = new Date('2023-05-15T12:00:00Z')

  // Sample data
  const mockDeckId = '123e4567-e89b-12d3-a456-426614174000'

  const mockProgress1 = new Progress({
    cardId: 'card-1',
    deckId: mockDeckId,
    interval: 10,
    repetitions: 3,
    easeFactor: 2.5,
    nextReview: '2023-05-15T10:00:00Z', // Due today (earlier than current time)
  })

  const mockProgress2 = new Progress({
    cardId: 'card-2',
    deckId: mockDeckId,
    interval: 5,
    repetitions: 2,
    easeFactor: 2.2,
    nextReview: '2023-05-14T12:00:00Z', // Due yesterday
  })

  const mockCard1 = new Card({
    deckId: mockDeckId,
    question: 'Question 1',
    answer: 'Answer 1',
  })

  const mockCard2 = new Card({
    deckId: mockDeckId,
    question: 'Question 2',
    answer: 'Answer 2',
  })

  const mockCard3 = new Card({
    deckId: mockDeckId,
    question: 'Question 3',
    answer: 'Answer 3',
  })

  // Setup mockId property on cards to match progress cardIds
  Object.defineProperty(mockCard1, 'id', { value: 'card-1' })
  Object.defineProperty(mockCard2, 'id', { value: 'card-2' })
  Object.defineProperty(mockCard3, 'id', { value: 'card-3' })

  beforeEach(() => {
    // Reset date for each test
    vi.setSystemTime(today)

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
    sut = new FindDueCardsUseCase(progressRepository, cardRepository)

    // Spy on console.log
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('should return due cards ordered by interval (highest first)', async () => {
    // Arrange
    vi.mocked(progressRepository.findDueCards).mockResolvedValueOnce([
      mockProgress1,
      mockProgress2,
    ])

    vi.mocked(cardRepository.findById).mockImplementation(async (id) => {
      if (id === 'card-1') return mockCard1
      if (id === 'card-2') return mockCard2
      return null
    })

    // Act
    const result = await sut.execute({ date: today })

    // Assert
    expect(progressRepository.findDueCards).toHaveBeenCalledWith(
      today,
      undefined,
    )
    expect(cardRepository.findById).toHaveBeenCalledTimes(2)
    expect(result).toHaveLength(2)

    // Check if properly ordered by interval (highest first)
    expect(result[0].progress.interval).toBe(10) // First should be mockProgress1 (interval 10)
    expect(result[1].progress.interval).toBe(5) // Second should be mockProgress2 (interval 5)
    expect(result[0].card.question).toBe('Question 1')
    expect(result[1].card.question).toBe('Question 2')
  })

  it('should filter by deckId when provided', async () => {
    // Arrange
    const specificDeckId = 'specific-deck'
    vi.mocked(progressRepository.findDueCards).mockResolvedValueOnce([
      mockProgress1,
    ])
    vi.mocked(cardRepository.findById).mockResolvedValueOnce(mockCard1)

    // Act
    await sut.execute({ date: today, deckId: specificDeckId })

    // Assert
    expect(progressRepository.findDueCards).toHaveBeenCalledWith(
      today,
      specificDeckId,
    )
  })

  it('should return empty array when no due cards found', async () => {
    // Arrange
    vi.mocked(progressRepository.findDueCards).mockResolvedValueOnce([])

    // Act
    const result = await sut.execute()

    // Assert
    expect(result).toEqual([])
    // Verify we don't do unnecessary card fetching
    expect(cardRepository.findById).not.toHaveBeenCalled()
  })

  it('should exclude cards that could not be found', async () => {
    // Arrange
    vi.mocked(progressRepository.findDueCards).mockResolvedValueOnce([
      mockProgress1,
      mockProgress2,
    ])

    // Only mockCard1 exists, mockCard2 is "deleted"
    vi.mocked(cardRepository.findById).mockImplementation(async (id) => {
      if (id === 'card-1') return mockCard1
      return null
    })

    // Act
    const result = await sut.execute()

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0].card.id).toBe('card-1')
  })

  it('should use current date when no date provided', async () => {
    // Arrange
    vi.mocked(progressRepository.findDueCards).mockResolvedValueOnce([])

    // Act
    await sut.execute() // No date provided

    // Assert
    expect(progressRepository.findDueCards).toHaveBeenCalledWith(
      today,
      undefined,
    )
  })
})
