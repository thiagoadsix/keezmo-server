import { describe, expect, it, vi, beforeEach } from 'vitest'

import { Card } from '@/domain/entities/card'
import { Deck } from '@/domain/entities/deck'
import { CardNotFoundError } from '@/domain/errors/card/card-not-found-error'
import { DeckNotFoundError } from '@/domain/errors/deck/deck-not-found-error'
import { DeleteCardUseCase } from '@/domain/use-cases/card/delete-card.usecase'
import { StudyMode } from '@/domain/value-objects'

import { mockCardRepository } from '../../../@support/mocks/card-repository.mock'
import { mockDeckRepository } from '../../../@support/mocks/deck-repository.mock'
import { mockProgressRepository } from '../../../@support/mocks/progress-repository.mock'

describe('DeleteCardUseCase', () => {
  const userId = 'user-123'
  const deckId = 'deck-123'
  const cardId = 'card-123'

  const mockDeck = new Deck({
    userId,
    title: 'Test Deck',
    description: 'Test description',
    studyMode: new StudyMode('flashcard'),
  })
  Object.defineProperty(mockDeck, 'id', { value: deckId })

  const mockCard = new Card({
    deckId,
    question: 'Test question',
    answer: 'Test answer',
  })
  Object.defineProperty(mockCard, 'id', { value: cardId })

  let sut: DeleteCardUseCase

  beforeEach(() => {
    vi.resetAllMocks()

    mockDeckRepository.findByIdAndUserId.mockResolvedValue(mockDeck)
    mockCardRepository.findById.mockResolvedValue(mockCard)
    mockProgressRepository.deleteById.mockResolvedValue(undefined)
    mockCardRepository.deleteById.mockResolvedValue(undefined)

    sut = new DeleteCardUseCase(
      mockCardRepository,
      mockDeckRepository,
      mockProgressRepository,
    )
  })

  it('should delete card and its progress successfully', async () => {
    // Arrange
    const request = {
      cardId,
      deckId,
      userId,
    }

    // Act
    await sut.execute(request)

    // Assert
    expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(
      deckId,
      userId,
    )
    expect(mockCardRepository.findById).toHaveBeenCalledWith(cardId)
    expect(mockProgressRepository.deleteById).toHaveBeenCalledWith(cardId)
    expect(mockCardRepository.deleteById).toHaveBeenCalledWith(cardId)
  })

  it('should throw DeckNotFoundError when deck does not exist', async () => {
    // Arrange
    mockDeckRepository.findByIdAndUserId.mockResolvedValueOnce(null)

    const request = {
      cardId,
      deckId: 'non-existent-deck',
      userId,
    }

    // Act & Assert
    await expect(sut.execute(request)).rejects.toThrow(DeckNotFoundError)
    expect(mockCardRepository.findById).not.toHaveBeenCalled()
    expect(mockProgressRepository.deleteById).not.toHaveBeenCalled()
    expect(mockCardRepository.deleteById).not.toHaveBeenCalled()
  })

  it('should throw CardNotFoundError when card does not exist', async () => {
    // Arrange
    mockCardRepository.findById.mockResolvedValueOnce(null)

    const request = {
      cardId: 'non-existent-card',
      deckId,
      userId,
    }

    // Act & Assert
    await expect(sut.execute(request)).rejects.toThrow(CardNotFoundError)
    expect(mockProgressRepository.deleteById).not.toHaveBeenCalled()
    expect(mockCardRepository.deleteById).not.toHaveBeenCalled()
  })

  it('should throw CardNotFoundError when card belongs to a different deck', async () => {
    // Arrange
    const differentDeckCard = new Card({
      deckId: 'different-deck',
      question: 'Test question',
      answer: 'Test answer',
    })
    Object.defineProperty(differentDeckCard, 'id', { value: cardId })

    mockCardRepository.findById.mockResolvedValueOnce(differentDeckCard)

    const request = {
      cardId,
      deckId,
      userId,
    }

    // Act & Assert
    await expect(sut.execute(request)).rejects.toThrow(CardNotFoundError)
    expect(mockProgressRepository.deleteById).not.toHaveBeenCalled()
    expect(mockCardRepository.deleteById).not.toHaveBeenCalled()
  })

  it('should continue deleting card even if progress deletion fails', async () => {
    // Arrange
    mockProgressRepository.deleteById.mockRejectedValueOnce(
      new Error('Progress deletion failed'),
    )

    const request = {
      cardId,
      deckId,
      userId,
    }

    // Act
    await sut.execute(request)

    // Assert
    expect(mockProgressRepository.deleteById).toHaveBeenCalledWith(cardId)
    expect(mockCardRepository.deleteById).toHaveBeenCalledWith(cardId)
  })
})
