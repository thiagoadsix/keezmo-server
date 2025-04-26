import { StudyModeEnum } from '@/domain/value-objects'

import { mockId } from '../mocks/generate-id.mock'

export const validMultipleChoiceSessionProps = {
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyMode: StudyModeEnum.MULTIPLE_CHOICE,
}

export const validFlashcardSessionProps = {
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyMode: StudyModeEnum.FLASHCARD,
}

export const invalidSessionPropsWithoutDeckId = {
  deckId: '',
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyMode: StudyModeEnum.MULTIPLE_CHOICE,
}

export const invalidSessionPropsWithoutStartTime = {
  deckId: mockId,
  startTime: '',
  endTime: '2023-05-15T10:30:00Z',
  studyMode: StudyModeEnum.MULTIPLE_CHOICE,
}

export const invalidSessionPropsWithInvalidStudyType = {
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyMode: 'invalid-type' as StudyModeEnum,
}
