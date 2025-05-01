import { InvalidStudyModeError } from '@/domain/errors/deck'
import { StudySessionValidationError } from '@/domain/errors/study-session/study-session-validation-error'
import { StudyModeEnum } from '@/domain/value-objects'

import { generateId } from '@/shared/utils/generate-id'

interface StudySessionProps {
  id?: string
  deckId: string
  userId: string
  startTime: string
  endTime?: string | null
  studyMode: StudyModeEnum
  createdAt?: string
  updatedAt?: string
}

export class StudySession {
  public readonly id: string
  public deckId: string
  public userId: string
  public startTime: string
  public endTime?: string | null
  public studyMode: StudyModeEnum
  public readonly createdAt: string
  public updatedAt: string

  constructor(props: StudySessionProps) {
    this.validateProps(props)

    this.id = props.id ?? generateId()
    this.deckId = props.deckId
    this.userId = props.userId
    this.startTime = props.startTime
    this.endTime = props.endTime
    this.studyMode = props.studyMode

    this.createdAt = props.createdAt ?? new Date().toISOString()
    this.updatedAt = props.updatedAt ?? this.createdAt
  }

  private validateProps(props: StudySessionProps): void {
    if (!props.deckId) {
      throw new StudySessionValidationError('DeckId is required')
    }

    if (!props.startTime) {
      throw new StudySessionValidationError('Start time is required')
    }

    if (
      props.studyMode !== StudyModeEnum.MULTIPLE_CHOICE &&
      props.studyMode !== StudyModeEnum.FLASHCARD
    ) {
      throw new InvalidStudyModeError(props.studyMode)
    }
  }

  public setEndTime(endTime: string): void {
    if (!endTime) {
      throw new StudySessionValidationError('End time is required')
    }

    this.endTime = endTime
  }

  public setStartTime(startTime: string): void {
    if (!startTime) {
      throw new StudySessionValidationError('Start time is required')
    }

    this.startTime = startTime
  }
}
