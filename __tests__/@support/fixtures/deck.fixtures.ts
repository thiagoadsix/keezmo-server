import { Card } from '@/domain/entities/card'
import { StudyMode } from '@/domain/value-objects'

import { mockId } from '../mocks/shared/utils/generate-id.mock'

export const validDeckProps = {
  userId: 'user-123',
  title: 'Math Concepts',
  description: 'Basic math concepts for beginners',
  studyMode: new StudyMode('flashcard'),
}

export const validFlashcardDeckProps = {
  userId: 'user-123',
  title: 'Biology 101',
  description: 'Introduction to biology concepts',
  studyMode: new StudyMode('flashcard'),
}

export const validMultipleChoiceDeckProps = {
  userId: 'user-123',
  title: 'History Quiz',
  description: 'Test your knowledge of world history',
  studyMode: new StudyMode('multiple_choice'),
}

export const validDeckWithCardsProps = {
  userId: 'user-123',
  title: 'Geography',
  description: 'Geography questions',
  studyMode: new StudyMode('multiple_choice'),
  cards: [
    new Card({
      deckId: mockId,
      question: 'What is the capital of France?',
      answer: 'Paris',
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2023-01-01T10:00:00Z',
    }),
    new Card({
      deckId: mockId,
      question: 'What is the capital of Germany?',
      answer: 'Berlin',
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2023-01-01T10:00:00Z',
    }),
  ],
}

export const invalidDeckPropsWithEmptyTitle = {
  userId: 'user-123',
  title: '',
  description: 'A deck with an empty title',
  studyMode: new StudyMode('flashcard'),
}

export const invalidDeckPropsWithNullDescription = {
  userId: 'user-123',
  title: 'Physics',
  description: null as unknown as string,
  studyMode: new StudyMode('flashcard'),
}
