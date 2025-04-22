import { QuestionMetadata } from '@/domain/entities/study-session'
import { StudyType } from '@/domain/types'
import { Difficulty, DifficultyEnum } from '@/domain/value-objects'

import { mockId } from '../mocks/generate-id.mock'

// Common metadata for both types of session
const baseQuestionMetadata: QuestionMetadata[] = [
  {
    questionId: 'question-1',
    attempts: 3,
    consecutiveHits: 2,
    errors: 1,
  },
  {
    questionId: 'question-2',
    attempts: 2,
    consecutiveHits: 0,
    errors: 2,
  },
]

// Valid study session with multiple choice type
export const validMultipleChoiceSessionProps = {
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyType: 'multiple_choice' as StudyType,
  questionsMetadata: [...baseQuestionMetadata],
  hits: 5,
  misses: 2,
}

// Valid study session with flashcard type
export const validFlashcardSessionProps = {
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyType: 'flashcard' as StudyType,
  ratings: [
    {
      questionId: 'question-1',
      difficulty: new Difficulty(DifficultyEnum.EASY),
    },
    {
      questionId: 'question-2',
      difficulty: new Difficulty(DifficultyEnum.HARD),
    },
  ],
}

// Invalid props with missing required fields
export const invalidSessionPropsWithoutDeckId = {
  deckId: '',
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyType: 'multiple_choice' as StudyType,
  questionsMetadata: [...baseQuestionMetadata],
}

export const invalidSessionPropsWithoutStartTime = {
  deckId: mockId,
  startTime: '',
  endTime: '2023-05-15T10:30:00Z',
  studyType: 'multiple_choice' as StudyType,
  questionsMetadata: [...baseQuestionMetadata],
}

export const invalidSessionPropsWithoutEndTime = {
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '',
  studyType: 'multiple_choice' as StudyType,
  questionsMetadata: [...baseQuestionMetadata],
}

// Invalid props with wrong study type
export const invalidSessionPropsWithInvalidStudyType = {
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyType: 'invalid-type' as StudyType,
  questionsMetadata: [...baseQuestionMetadata],
}

// Flashcard session with hits (incompatible)
export const invalidFlashcardSessionWithHits = {
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyType: 'flashcard' as StudyType,
  questionsMetadata: [...baseQuestionMetadata],
  hits: 5,
  misses: 3,
}

// Multiple choice session with ratings (incompatible)
export const invalidMultipleChoiceSessionWithRatings = {
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyType: 'multiple_choice' as StudyType,
  questionsMetadata: [...baseQuestionMetadata],
  ratings: [
    {
      questionId: 'question-1',
      difficulty: new Difficulty(DifficultyEnum.EASY),
    },
  ],
}
