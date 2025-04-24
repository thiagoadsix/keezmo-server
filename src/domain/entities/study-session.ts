import { InvalidStudyModeError } from '@/domain/errors/deck'
import { StudySessionValidationError } from '@/domain/errors/study-session/study-session-validation-error'
import { StudyModeEnum } from '@/domain/value-objects'

import { generateId } from '@/shared/utils/generate-id'

interface StudySessionProps {
  deckId: string
  startTime: string
  endTime: string
  studyMode: StudyModeEnum
}

export class StudySession {
  public readonly id: string
  public deckId: string
  public startTime: string
  public endTime: string
  public studyMode: StudyModeEnum
  public readonly createdAt: string
  public updatedAt: string

  constructor(props: StudySessionProps) {
    this.validateProps(props)

    this.id = generateId()
    this.deckId = props.deckId
    this.startTime = props.startTime
    this.endTime = props.endTime
    this.studyMode = props.studyMode

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
