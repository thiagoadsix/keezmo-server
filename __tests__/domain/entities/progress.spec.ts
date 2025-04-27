/* eslint-disable import/order */
import {
  mockId,
  generateIdMock,
} from '../../@support/mocks/shared/utils/generate-id.mock'
/* eslint-enable import/order */

import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import { Progress } from '@/domain/entities/progress'
import { MissingProgressIdsError } from '@/domain/errors/progress/missing-ids-error'

import {
  validProgressProps,
  validProgressPropsMinimal,
  invalidProgressPropsWithoutCardId,
  invalidProgressPropsWithoutDeckId,
} from '../../@support/fixtures/progress.fixtures'

describe('Progress', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    generateIdMock.mockReturnValue(mockId)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  describe('constructor', () => {
    it('should create a valid Progress entity with full properties', () => {
      const progress = new Progress(validProgressProps)

      expect(progress).toBeInstanceOf(Progress)
      expect(progress.id).toBe(mockId)
      expect(progress.cardId).toBe(validProgressProps.cardId)
      expect(progress.deckId).toBe(validProgressProps.deckId)
      expect(progress.repetitions).toBe(validProgressProps.repetitions)
      expect(progress.interval).toBe(validProgressProps.interval)
      expect(progress.easeFactor).toBe(validProgressProps.easeFactor)
      expect(progress.nextReview).toBe(validProgressProps.nextReview)
      expect(progress.lastReviewed).toBe(validProgressProps.lastReviewed)
      expect(generateIdMock).toHaveBeenCalledTimes(1)
    })

    it('should create a valid Progress entity with minimal properties and default values', () => {
      const fixedDate = new Date('2023-01-01T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      const progress = new Progress(validProgressPropsMinimal)

      expect(progress).toBeInstanceOf(Progress)
      expect(progress.id).toBe(mockId)
      expect(progress.cardId).toBe(validProgressPropsMinimal.cardId)
      expect(progress.deckId).toBe(validProgressPropsMinimal.deckId)
      expect(progress.repetitions).toBe(0)
      expect(progress.interval).toBe(0)
      expect(progress.easeFactor).toBe(2.5)
      expect(progress.nextReview).toBe(expectedDateString)
      expect(progress.lastReviewed).toBe(expectedDateString)
      expect(progress.createdAt).toBe(expectedDateString)
      expect(progress.updatedAt).toBe(expectedDateString)
    })

    it('should throw MissingProgressIdsError when cardId is missing', () => {
      expect(
        () =>
          // @ts-expect-error Testing invalid input
          new Progress(invalidProgressPropsWithoutCardId),
      ).toThrow(MissingProgressIdsError)
    })

    it('should throw MissingProgressIdsError when deckId is missing', () => {
      expect(
        () =>
          // @ts-expect-error Testing invalid input
          new Progress(invalidProgressPropsWithoutDeckId),
      ).toThrow(MissingProgressIdsError)
    })
  })

  describe('applyScheduling', () => {
    it('should update review metrics and timestamps', () => {
      const progress = new Progress(validProgressProps)
      const fixedDate = new Date('2023-01-05T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()
      const nextReviewDate = new Date('2023-01-10T12:00:00Z')

      const newRepetitions = 2
      const newInterval = 5
      const newEaseFactor = 2.2

      progress.applyScheduling(
        newRepetitions,
        newInterval,
        newEaseFactor,
        nextReviewDate,
      )

      expect(progress.repetitions).toBe(newRepetitions)
      expect(progress.interval).toBe(newInterval)
      expect(progress.easeFactor).toBe(newEaseFactor)
      expect(progress.lastReviewed).toBe(expectedDateString)
      expect(progress.nextReview).toBe(nextReviewDate.toISOString())
      expect(progress.updatedAt).toBe(expectedDateString)
    })
  })
})
