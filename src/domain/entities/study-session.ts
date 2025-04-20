import { generateId } from '@/shared/utils/generate-id'

import { InvalidQuestionMetadataError } from '../errors/study-session/invalid-question-metadata-error'
import { InvalidStudyTypeError } from '../errors/study-session/invalid-study-type-error'
import { StudySessionValidationError } from '../errors/study-session/study-session-validation-error'
import { StudyType } from '../types/study.type'
import { Rating } from '../value-objects'

interface StudySessionRating {
  questionId: string
  rating: Rating
}

// TODO: for now we'll use as interface
export interface QuestionMetadata {
  questionId: string
  attempts: number
  consecutiveHits: number
  errors: number
}

interface StudySessionProps {
  deckId: string
  startTime: string
  endTime: string
  studyType: StudyType
  // DOC: will be used only for studyType equals to multiple_choice
  questionsMetadata?: QuestionMetadata[] | null

  // DOC: will be used only for studyType equals to multiple_choice
  hits?: number | null
  misses?: number | null

  // DOC: will be used only for studyType equals to flashcard
  // PROBLEM: this is just terrible, what a terrible decision I made here
  ratings?: StudySessionRating[]
}

export class StudySession {
  public readonly id: string
  public deckId: string
  public startTime: string
  public endTime: string
  public studyType: StudyType
  public questionsMetadata?: QuestionMetadata[] | null
  public hits?: number | null
  public misses?: number | null
  // PROBLEM: this is just terrible, what a terrible decision I made here
  public ratings?: StudySessionRating[] | null

  public readonly createdAt: string
  public updatedAt: string

  constructor(props: StudySessionProps) {
    this.validateProps(props)

    this.id = generateId()
    this.deckId = props.deckId
    this.startTime = props.startTime
    this.endTime = props.endTime
    this.studyType = props.studyType
    this.questionsMetadata = props.questionsMetadata || []

    // Set based on study type
    if (this.studyType === 'multiple_choice') {
      this.hits = props.hits || 0
      this.misses = props.misses || 0
    } else if (this.studyType === 'flashcard') {
      this.ratings = props.ratings || []
    }

    this.createdAt = new Date().toISOString()
    this.updatedAt = this.createdAt
  }

  private validateProps(props: StudySessionProps): void {
    if (!props.deckId) {
      throw new StudySessionValidationError('DeckId is required')
    }

    if (!props.startTime) {
      throw new StudySessionValidationError('Start time is required')
    }

    if (!props.endTime) {
      throw new StudySessionValidationError('End time is required')
    }

    if (
      props.studyType !== 'multiple_choice' &&
      props.studyType !== 'flashcard'
    ) {
      throw new InvalidStudyTypeError(props.studyType)
    }

    if (
      props.studyType === 'multiple_choice' &&
      props.ratings &&
      props.ratings.length > 0
    ) {
      throw new StudySessionValidationError(
        'Ratings are only applicable for flashcard study type',
      )
    }

    if (
      props.studyType === 'flashcard' &&
      (props.hits !== undefined || props.misses !== undefined)
    ) {
      throw new StudySessionValidationError(
        'Hits and misses are only applicable for multiple choice study type',
      )
    }
  }

  public addQuestionMetadata(metadata: QuestionMetadata): void {
    if (!this.questionsMetadata) {
      this.questionsMetadata = []
    }

    if (!metadata.questionId) {
      throw new InvalidQuestionMetadataError('Question ID is required')
    }

    this.questionsMetadata.push(metadata)
    this.updatedAt = new Date().toISOString()
  }

  public updateQuestionMetadata(
    questionId: string,
    updates: Partial<QuestionMetadata>,
  ): void {
    if (!this.questionsMetadata) {
      this.questionsMetadata = []
    }

    const index = this.questionsMetadata.findIndex(
      (qm) => qm.questionId === questionId,
    )

    if (index === -1) {
      throw new InvalidQuestionMetadataError(
        `Question with id ${questionId} not found in study session`,
      )
    }

    this.questionsMetadata[index] = {
      ...this.questionsMetadata[index],
      ...updates,
    }

    this.updatedAt = new Date().toISOString()
  }

  public addRating(rating: StudySessionRating): void {
    if (this.studyType !== 'flashcard') {
      throw new StudySessionValidationError(
        'Ratings can only be added to flashcard study sessions',
      )
    }

    if (!rating.questionId) {
      throw new InvalidQuestionMetadataError(
        'Question ID is required for rating',
      )
    }

    if (!this.ratings) {
      this.ratings = []
    }

    this.ratings.push(rating)
    this.updatedAt = new Date().toISOString()
  }

  public incrementHits(): void {
    if (this.studyType !== 'multiple_choice') {
      throw new StudySessionValidationError(
        'Hits can only be incremented in multiple choice study sessions',
      )
    }

    this.hits = (this.hits || 0) + 1
    this.updatedAt = new Date().toISOString()
  }

  public incrementMisses(): void {
    if (this.studyType !== 'multiple_choice') {
      throw new StudySessionValidationError(
        'Misses can only be incremented in multiple choice study sessions',
      )
    }

    this.misses = (this.misses || 0) + 1
    this.updatedAt = new Date().toISOString()
  }

  public setEndTime(endTime: string): void {
    if (!endTime) {
      throw new StudySessionValidationError('End time is required')
    }

    this.endTime = endTime
    this.updatedAt = new Date().toISOString()
  }

  public getTotalAttempts(): number {
    if (!this.questionsMetadata) {
      return 0
    }

    return this.questionsMetadata.reduce((sum, qm) => sum + qm.attempts, 0)
  }

  public getTotalErrors(): number {
    if (!this.questionsMetadata) {
      return 0
    }

    return this.questionsMetadata.reduce((sum, qm) => sum + qm.errors, 0)
  }

  public getAccuracy(): number {
    if (this.studyType === 'multiple_choice') {
      const total = (this.hits || 0) + (this.misses || 0)
      return total > 0 ? ((this.hits || 0) / total) * 100 : 0
    }

    const totalAttempts = this.getTotalAttempts()
    const totalErrors = this.getTotalErrors()

    return totalAttempts > 0
      ? ((totalAttempts - totalErrors) / totalAttempts) * 100
      : 0
  }
}
