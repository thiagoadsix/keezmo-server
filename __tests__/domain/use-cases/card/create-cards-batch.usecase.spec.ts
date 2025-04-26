import { describe, expect, it, vi, beforeEach } from 'vitest'

import { Card } from '@/domain/entities/card'
import { Progress } from '@/domain/entities/progress'
import { DeckNotFoundError } from '@/domain/errors/deck/deck-not-found-error'
import { CreateCardsBatchUseCase } from '@/domain/use-cases/card/create-cards-batch.usecase'

import { mockCardRepository } from '../../../@support/mocks/repositories/card-repository.mock'
import { mockDeckRepository } from '../../../@support/mocks/repositories/deck-repository.mock'
import { mockProgressRepository } from '../../../@support/mocks/repositories/progress-repository.mock'

describe('CreateCardsBatchUseCase', () => {
  const userId = 'user-123'
  const deckId = 'deck-123'
  const validCardBatch = [
    {
      question: 'Question 1',
      answer: 'Answer 1',
    },
    {
      question: 'Question 2',
      answer: 'Answer 2',
    },
    {
      question: 'Question 3',
      answer: 'Answer 3',
    },
  ]

  let sut: CreateCardsBatchUseCase

  beforeEach(() => {
    vi.resetAllMocks()

    mockDeckRepository.findByIdAndUserId.mockResolvedValue({
      id: deckId,
      userId,
    })
    mockCardRepository.saveBatch = vi.fn().mockResolvedValue(undefined)
    mockProgressRepository.saveBatch = vi.fn().mockResolvedValue(undefined)

    sut = new CreateCardsBatchUseCase(
      mockCardRepository,
      mockDeckRepository,
      mockProgressRepository,
    )
  })

  it('should create multiple cards and their progresses successfully', async () => {
    const request = {
      deckId,
      userId,
      cards: validCardBatch,
    }

    await sut.execute(request)

    expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(
      deckId,
      userId,
    )
    expect(mockCardRepository.saveBatch).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(Card)]),
    )
    expect(mockProgressRepository.saveBatch).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(Progress)]),
    )

    const savedCards = mockCardRepository.saveBatch.mock.calls[0][0] as Card[]
    const savedProgresses = mockProgressRepository.saveBatch.mock
      .calls[0][0] as Progress[]

    expect(savedCards).toHaveLength(validCardBatch.length)
    expect(savedProgresses).toHaveLength(validCardBatch.length)

    savedCards.forEach((card, index) => {
      expect(card.question).toBe(validCardBatch[index].question)
      expect(card.answer).toBe(validCardBatch[index].answer)
      expect(card.deckId).toBe(deckId)

      const matchingProgress = savedProgresses.find((p) => p.cardId === card.id)
      expect(matchingProgress).toBeDefined()
      expect(matchingProgress!.deckId).toBe(deckId)
      expect(matchingProgress!.repetitions).toBe(0)
    })
  })

  it('should throw DeckNotFoundError when deck does not exist', async () => {
    mockDeckRepository.findByIdAndUserId.mockResolvedValueOnce(null)

    const request = {
      deckId: 'non-existent-deck',
      userId,
      cards: validCardBatch,
    }

    await expect(sut.execute(request)).rejects.toThrow(DeckNotFoundError)
    expect(mockCardRepository.saveBatch).not.toHaveBeenCalled()
    expect(mockProgressRepository.saveBatch).not.toHaveBeenCalled()
  })

  it('should do nothing when cards array is empty', async () => {
    const request = {
      deckId,
      userId,
      cards: [],
    }

    await sut.execute(request)

    expect(mockCardRepository.saveBatch).not.toHaveBeenCalled()
    expect(mockProgressRepository.saveBatch).not.toHaveBeenCalled()
  })
})
