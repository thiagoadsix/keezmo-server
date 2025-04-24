import { StudyModeEnum } from '@/domain/value-objects'

import { mockId } from '../mocks/generate-id.mock'

// Valid study session with multiple choice type
export const validMultipleChoiceSessionProps = {
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyMode: StudyModeEnum.MULTIPLE_CHOICE,
}

// Valid study session with flashcard type
export const validFlashcardSessionProps = {
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyMode: StudyModeEnum.FLASHCARD,
}

// Invalid props with missing required fields
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

export const invalidSessionPropsWithoutEndTime = {
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '',
  studyMode: StudyModeEnum.MULTIPLE_CHOICE,
}

// Invalid props with wrong study type
export const invalidSessionPropsWithInvalidStudyType = {
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyMode: 'invalid-type' as StudyModeEnum,
}

// Flashcard session with hits (incompatible)
export const invalidFlashcardSessionWithHits = {
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyMode: StudyModeEnum.FLASHCARD,
}

// Multiple choice session with ratings (incompatible)
export const invalidMultipleChoiceSessionWithRatings = {
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyMode: StudyModeEnum.MULTIPLE_CHOICE,
}
