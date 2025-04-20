/* eslint-disable import/order */
import { mockId, generateIdMock } from '../../@support/mocks/generate-id.mock'
/* eslint-enable import/order */

import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import { Card } from '@/domain/entities/card'
import { InvalidAnswerIndexError } from '@/domain/errors/card/invalid-answer-index-error'
import { InvalidCardAnswerError } from '@/domain/errors/card/invalid-card-answer-error'
import { InvalidCardQuestionError } from '@/domain/errors/card/invalid-card-question-error'

import {
  validCardProps,
  validCardPropsWithOptions,
  invalidCardPropsWithEmptyQuestion,
  invalidCardPropsWithEmptyAnswer,
  invalidCardPropsWithInvalidAnswerIndex,
} from '../../@support/fixtures/card.fixtures'

describe('Card', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    generateIdMock.mockReturnValue(mockId)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  describe('constructor', () => {
    it('should create a valid Card entity with basic properties', () => {
      const fixedDate = new Date('2023-01-01T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      const card = new Card(validCardProps)

      expect(card).toBeInstanceOf(Card)
      expect(card.id).toBe(mockId)
      expect(card.deckId).toBe(validCardProps.deckId)
      expect(card.question).toBe(validCardProps.question)
      expect(card.answer).toBe(validCardProps.answer)
      expect(card.options).toBeUndefined()
      expect(card.answerIndex).toBeUndefined()
      expect(card.createdAt).toBe(expectedDateString)
      expect(card.updatedAt).toBe(expectedDateString)
      expect(generateIdMock).toHaveBeenCalledTimes(1)
    })

    it('should create a valid Card entity with options and answer index', () => {
      const card = new Card(validCardPropsWithOptions)

      expect(card.options).toEqual(validCardPropsWithOptions.options)
      expect(card.answerIndex).toBe(validCardPropsWithOptions.answerIndex)
    })

    it('should create a Card with specified id, createdAt and updatedAt', () => {
      const createdAt = '2023-01-01T10:00:00Z'
      const updatedAt = '2023-01-02T10:00:00Z'

      const card = new Card({
        ...validCardProps,
        createdAt,
        updatedAt,
      })

      expect(card.createdAt).toBe(createdAt)
      expect(card.updatedAt).toBe(updatedAt)
    })

    it('should throw InvalidCardQuestionError when question is empty', () => {
      expect(() => new Card(invalidCardPropsWithEmptyQuestion)).toThrow(
        InvalidCardQuestionError,
      )
    })

    it('should throw InvalidCardAnswerError when answer is empty', () => {
      expect(() => new Card(invalidCardPropsWithEmptyAnswer)).toThrow(
        InvalidCardAnswerError,
      )
    })

    it('should throw InvalidAnswerIndexError when answer index is out of bounds', () => {
      expect(() => new Card(invalidCardPropsWithInvalidAnswerIndex)).toThrow(
        InvalidAnswerIndexError,
      )
    })
  })

  describe('updateQuestion', () => {
    it('should update the question and updatedAt', () => {
      const card = new Card(validCardProps)
      const newQuestion = 'What is the capital of Germany?'
      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      card.updateQuestion(newQuestion)

      expect(card.question).toBe(newQuestion)
      expect(card.updatedAt).toBe(expectedDateString)
    })

    it('should throw InvalidCardQuestionError when new question is empty', () => {
      const card = new Card(validCardProps)

      expect(() => card.updateQuestion('')).toThrow(InvalidCardQuestionError)
    })
  })

  describe('updateAnswer', () => {
    it('should update the answer and updatedAt', () => {
      const card = new Card(validCardProps)
      const newAnswer = 'Berlin'
      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      card.updateAnswer(newAnswer)

      expect(card.answer).toBe(newAnswer)
      expect(card.updatedAt).toBe(expectedDateString)
    })

    it('should throw InvalidCardAnswerError when new answer is empty', () => {
      const card = new Card(validCardProps)

      expect(() => card.updateAnswer('')).toThrow(InvalidCardAnswerError)
    })
  })

  describe('updateOptions', () => {
    it('should update the options and updatedAt', () => {
      const card = new Card(validCardPropsWithOptions)
      const newOptions = ['Madrid', 'Berlin', 'Paris', 'Rome', 'London']
      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      card.updateOptions(newOptions)

      expect(card.options).toEqual(newOptions)
      expect(card.updatedAt).toBe(expectedDateString)
    })

    it('should reset answerIndex when it becomes invalid after updating options', () => {
      const card = new Card(validCardPropsWithOptions)
      const newOptions = ['Option 1']

      card.updateOptions(newOptions)

      expect(card.options).toEqual(newOptions)
      expect(card.answerIndex).toBeUndefined()
    })
  })

  describe('updateAnswerIndex', () => {
    it('should update the answerIndex and updatedAt', () => {
      const card = new Card(validCardPropsWithOptions)
      const newAnswerIndex = 2
      const fixedDate = new Date('2023-01-02T12:00:00Z')
      vi.setSystemTime(fixedDate)
      const expectedDateString = fixedDate.toISOString()

      card.updateAnswerIndex(newAnswerIndex)

      expect(card.answerIndex).toBe(newAnswerIndex)
      expect(card.updatedAt).toBe(expectedDateString)
    })

    it('should throw InvalidAnswerIndexError when new index is out of bounds', () => {
      const card = new Card(validCardPropsWithOptions)

      expect(() => card.updateAnswerIndex(10)).toThrow(InvalidAnswerIndexError)
    })

    it('should throw Error when no options are available', () => {
      const card = new Card(validCardProps) // No options

      expect(() => card.updateAnswerIndex(0)).toThrow(
        'Cannot set answer index when no options are available',
      )
    })
  })
})
