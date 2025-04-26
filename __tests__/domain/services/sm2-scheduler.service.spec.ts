import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import { InvalidDifficultyError } from '@/domain/errors/invalid-difficulty-error'
import { SM2SchedulerService } from '@/domain/services/sm2-scheduler.service'
import { DifficultyEnum } from '@/domain/value-objects'

import {
  newCardProgress,
  firstReviewProgress,
  secondReviewProgress,
  matureCardProgress,
  invalidDifficulty,
} from '../../@support/fixtures/sm2-scheduler.fixtures'

describe('SM2SchedulerService', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    const fixedDate = new Date('2023-01-01T12:00:00Z')
    vi.setSystemTime(fixedDate)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  describe('execute', () => {
    it('should throw InvalidDifficultyError when invalid difficulty is provided', () => {
      expect(() =>
        SM2SchedulerService.execute({
          progress: newCardProgress,
          // @ts-expect-error Testing invalid input
          difficulty: invalidDifficulty,
        }),
      ).toThrow(InvalidDifficultyError)
    })

    describe('when difficulty is "again" (quality < 3)', () => {
      it('should reset repetitions and interval for a card regardless of its state', () => {
        const result = SM2SchedulerService.execute({
          progress: matureCardProgress,
          difficulty: DifficultyEnum.AGAIN,
        })

        expect(result.updated.repetitions).toBe(0)
        expect(result.updated.interval).toBe(1)
        expect(result.updated.easeFactor).toBeLessThan(
          matureCardProgress.easeFactor,
        )
        expect(result.updated.easeFactor).toBeGreaterThanOrEqual(1.3)
      })
    })

    describe('when difficulty is "hard" or better (quality >= 3)', () => {
      it('should increase repetitions by 1 for a card', () => {
        const result = SM2SchedulerService.execute({
          progress: newCardProgress,
          difficulty: DifficultyEnum.HARD,
        })

        expect(result.updated.repetitions).toBe(newCardProgress.repetitions + 1)
      })

      it('should set interval to 1 day for first repetition (rep=1)', () => {
        const result = SM2SchedulerService.execute({
          progress: newCardProgress,
          difficulty: DifficultyEnum.NORMAL,
        })

        expect(result.updated.repetitions).toBe(1)
        expect(result.updated.interval).toBe(1)
      })

      it('should set interval to 6 days for second repetition (rep=2)', () => {
        const result = SM2SchedulerService.execute({
          progress: firstReviewProgress,
          difficulty: DifficultyEnum.NORMAL,
        })

        expect(result.updated.repetitions).toBe(2)
        expect(result.updated.interval).toBe(6)
      })

      it('should calculate interval based on formula for mature cards (rep>2)', () => {
        const result = SM2SchedulerService.execute({
          progress: secondReviewProgress,
          difficulty: DifficultyEnum.NORMAL,
        })

        const expectedInterval = Math.round(
          secondReviewProgress.interval * secondReviewProgress.easeFactor,
        )
        expect(result.updated.repetitions).toBe(3)
        expect(result.updated.interval).toBe(expectedInterval)
      })
    })

    describe('ease factor adjustments', () => {
      it('should decrease ease factor for "again" response', () => {
        const result = SM2SchedulerService.execute({
          progress: firstReviewProgress,
          difficulty: DifficultyEnum.AGAIN,
        })

        expect(result.updated.easeFactor).toBeLessThan(
          firstReviewProgress.easeFactor,
        )
      })

      it('should decrease ease factor for "hard" response, but less than for "again"', () => {
        const againResult = SM2SchedulerService.execute({
          progress: firstReviewProgress,
          difficulty: DifficultyEnum.AGAIN,
        })

        const hardResult = SM2SchedulerService.execute({
          progress: firstReviewProgress,
          difficulty: DifficultyEnum.HARD,
        })

        expect(hardResult.updated.easeFactor).toBeLessThan(
          firstReviewProgress.easeFactor,
        )
        expect(hardResult.updated.easeFactor).toBeGreaterThan(
          againResult.updated.easeFactor,
        )
      })

      it('should increase ease factor for "easy" response', () => {
        const result = SM2SchedulerService.execute({
          progress: firstReviewProgress,
          difficulty: DifficultyEnum.EASY,
        })

        expect(result.updated.easeFactor).toBeGreaterThan(
          firstReviewProgress.easeFactor,
        )
      })

      it('should maintain ease factor minimum of 1.3', () => {
        const lowEFProgress = { ...firstReviewProgress, easeFactor: 1.3 }

        const result = SM2SchedulerService.execute({
          // @ts-expect-error Using modified progress object
          progress: lowEFProgress,
          difficulty: DifficultyEnum.AGAIN,
        })

        expect(result.updated.easeFactor).toBe(1.3)
      })
    })

    describe('dates and timestamps', () => {
      it('should set nextReview based on the current date plus interval', () => {
        const fixedDate = new Date('2023-01-01T12:00:00Z')
        vi.setSystemTime(fixedDate)

        const result = SM2SchedulerService.execute({
          progress: firstReviewProgress,
          difficulty: DifficultyEnum.NORMAL,
        })

        const expectedDate = new Date(fixedDate)
        expectedDate.setUTCDate(
          expectedDate.getUTCDate() + result.updated.interval,
        )

        expect(result.updated.nextReview).toBe(expectedDate.toISOString())
      })

      it('should update lastReviewed and updatedAt to current timestamp', () => {
        const fixedDate = new Date('2023-01-01T12:00:00Z')
        vi.setSystemTime(fixedDate)
        const expectedDateString = fixedDate.toISOString()

        const result = SM2SchedulerService.execute({
          progress: firstReviewProgress,
          difficulty: DifficultyEnum.NORMAL,
        })

        expect(result.updated.lastReviewed).toBe(expectedDateString)
        expect(result.updated.updatedAt).toBe(expectedDateString)
      })
    })

    describe('BDD Scenarios', () => {
      it('Given a new card with no prior reviews, When reviewed as "normal", Then it should be scheduled for tomorrow', () => {
        const result = SM2SchedulerService.execute({
          progress: newCardProgress,
          difficulty: DifficultyEnum.NORMAL,
        })

        expect(result.updated.repetitions).toBe(1)
        expect(result.updated.interval).toBe(1)

        const expectedDate = new Date()
        expectedDate.setUTCDate(expectedDate.getUTCDate() + 1)
        expect(new Date(result.updated.nextReview).getUTCDate()).toBe(
          expectedDate.getUTCDate(),
        )
      })

      it('Given a card reviewed once before, When reviewed as "easy", Then it should be scheduled with longer interval', () => {
        const result = SM2SchedulerService.execute({
          progress: firstReviewProgress,
          difficulty: DifficultyEnum.EASY,
        })

        expect(result.updated.repetitions).toBe(2)
        expect(result.updated.interval).toBe(6)
        expect(result.updated.easeFactor).toBeGreaterThan(
          firstReviewProgress.easeFactor,
        )
      })

      it('Given a mature card with multiple reviews, When reviewed as "again", Then it should be reset and scheduled for tomorrow', () => {
        const result = SM2SchedulerService.execute({
          progress: matureCardProgress,
          difficulty: DifficultyEnum.AGAIN,
        })

        expect(result.updated.repetitions).toBe(0)
        expect(result.updated.interval).toBe(1)
        expect(result.updated.easeFactor).toBeLessThan(
          matureCardProgress.easeFactor,
        )
      })
    })
  })
})
