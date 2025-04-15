import { InvalidAnswerIndexError } from '@/domain/errors/card/invalid-answer-index-error'
import { InvalidCardAnswerError } from '@/domain/errors/card/invalid-card-answer-error'
import { InvalidCardQuestionError } from '@/domain/errors/card/invalid-card-question-error'

import { generateId } from '@/shared/utils/generate-id'

interface CardProps {
  deckId: string
  question: string
  answer: string
  options?: string[]
  answerIndex?: number
  createdAt?: string
  updatedAt?: string
}

export class Card {
  public readonly id: string
  public readonly deckId: string
  public question: string
  public answer: string
  public options?: string[]
  public answerIndex?: number
  public readonly createdAt: string
  public updatedAt: string

  constructor(props: CardProps) {
    if (!this.isValidQuestion(props.question)) {
      throw new InvalidCardQuestionError(props.question)
    }

    if (!this.isValidAnswer(props.answer)) {
      throw new InvalidCardAnswerError(props.answer)
    }

    if (
      props.options &&
      props.options.length > 0 &&
      props.answerIndex !== undefined
    ) {
      if (!this.isValidAnswerIndex(props.answerIndex, props.options.length)) {
        throw new InvalidAnswerIndexError(
          props.answerIndex,
          props.options.length,
        )
      }
    }

    this.id = generateId()
    this.deckId = props.deckId
    this.question = props.question
    this.answer = props.answer
    this.options = props.options
    this.answerIndex = props.answerIndex
    this.createdAt = props.createdAt || new Date().toISOString()
    this.updatedAt = props.updatedAt || this.createdAt
  }

  private isValidQuestion(question: string): boolean {
    return (
      question !== null && question !== undefined && question.trim().length > 0
    )
  }

  private isValidAnswer(answer: string): boolean {
    return answer !== null && answer !== undefined && answer.trim().length > 0
  }

  private isValidAnswerIndex(index: number, optionsLength: number): boolean {
    return index >= 0 && index < optionsLength
  }

  public updateQuestion(newQuestion: string): void {
    if (!this.isValidQuestion(newQuestion)) {
      throw new InvalidCardQuestionError(newQuestion)
    }

    this.question = newQuestion
    this.updatedAt = new Date().toISOString()
  }

  public updateAnswer(newAnswer: string): void {
    if (!this.isValidAnswer(newAnswer)) {
      throw new InvalidCardAnswerError(newAnswer)
    }

    this.answer = newAnswer
    this.updatedAt = new Date().toISOString()
  }

  public updateOptions(newOptions: string[]): void {
    this.options = newOptions

    if (
      this.answerIndex !== undefined &&
      !this.isValidAnswerIndex(this.answerIndex, newOptions.length)
    ) {
      this.answerIndex = undefined
    }

    this.updatedAt = new Date().toISOString()
  }

  public updateAnswerIndex(newAnswerIndex: number): void {
    if (!this.options || this.options.length === 0) {
      throw new Error('Cannot set answer index when no options are available')
    }

    if (!this.isValidAnswerIndex(newAnswerIndex, this.options.length)) {
      throw new InvalidAnswerIndexError(newAnswerIndex, this.options.length)
    }

    this.answerIndex = newAnswerIndex
    this.updatedAt = new Date().toISOString()
  }
}
