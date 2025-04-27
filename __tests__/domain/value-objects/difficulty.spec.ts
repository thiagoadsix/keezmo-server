import { describe, expect, it } from 'vitest'

import { InvalidStudySessionDifficultyError } from '@/domain/errors/study-session'
import { Difficulty, DifficultyEnum } from '@/domain/value-objects/difficulty'

describe('Difficulty', () => {
  describe('constructor', () => {
    it('should create a valid Difficulty with "again" value', () => {
      const difficulty = new Difficulty('again')

      expect(difficulty).toBeInstanceOf(Difficulty)
      expect(difficulty.getValue()).toBe(DifficultyEnum.AGAIN)
    })

    it('should create a valid Difficulty with "easy" value', () => {
      const difficulty = new Difficulty('easy')

      expect(difficulty).toBeInstanceOf(Difficulty)
      expect(difficulty.getValue()).toBe(DifficultyEnum.EASY)
    })

    it('should create a valid Difficulty with "normal" value', () => {
      const difficulty = new Difficulty('normal')

      expect(difficulty).toBeInstanceOf(Difficulty)
      expect(difficulty.getValue()).toBe(DifficultyEnum.NORMAL)
    })

    it('should create a valid Difficulty with "hard" value', () => {
      const difficulty = new Difficulty('hard')

      expect(difficulty).toBeInstanceOf(Difficulty)
      expect(difficulty.getValue()).toBe(DifficultyEnum.HARD)
    })

    it('should throw InvalidStudySessionDifficultyError for invalid difficulty', () => {
      const invalidDifficulty = 'invalid-difficulty'
      const validDifficulties = Object.values(DifficultyEnum).join(', ')

      expect(() => new Difficulty(invalidDifficulty)).toThrow(
        InvalidStudySessionDifficultyError,
      )
      expect(() => new Difficulty(invalidDifficulty)).toThrow(
        `The Study Session difficulty ${invalidDifficulty} is invalid. Valid difficulties are: ${validDifficulties}`,
      )
    })
  })

  describe('getValue', () => {
    it('should return the correct difficulty value', () => {
      const againDifficulty = new Difficulty('again')
      const easyDifficulty = new Difficulty('easy')
      const normalDifficulty = new Difficulty('normal')
      const hardDifficulty = new Difficulty('hard')

      expect(againDifficulty.getValue()).toBe(DifficultyEnum.AGAIN)
      expect(easyDifficulty.getValue()).toBe(DifficultyEnum.EASY)
      expect(normalDifficulty.getValue()).toBe(DifficultyEnum.NORMAL)
      expect(hardDifficulty.getValue()).toBe(DifficultyEnum.HARD)
    })
  })
})
