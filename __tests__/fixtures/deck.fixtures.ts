import { Card } from '@/domain/entities/card'
import { DeckType } from '@/domain/value-objects'

import { mockId } from '../mocks/generate-id.mock'

export const validDeckProps = {
  userId: 'user-123',
  title: 'Math Concepts',
  description: 'Basic math concepts for beginners',
  type: new DeckType('flashcard'),
}

export const validFlashcardDeckProps = {
  userId: 'user-123',
  title: 'Biology 101',
  description: 'Introduction to biology concepts',
  type: new DeckType('flashcard'),
}

export const validMultipleChoiceDeckProps = {
  userId: 'user-123',
  title: 'History Quiz',
  description: 'Test your knowledge of world history',
  type: new DeckType('multiple_choice'),
}

export const validDeckWithCardsProps = {
  userId: 'user-123',
  title: 'Geography',
  description: 'Geography questions',
  type: new DeckType('multiple_choice'),
  cards: [
    new Card({
      deckId: mockId,
      question: 'What is the capital of France?',
      answer: 'Paris',
      options: ['London', 'Paris', 'Berlin', 'Madrid'],
      answerIndex: 1,
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2023-01-01T10:00:00Z',
    }),
    new Card({
      deckId: mockId,
      question: 'What is the capital of Germany?',
      answer: 'Berlin',
      options: ['London', 'Paris', 'Berlin', 'Madrid'],
      answerIndex: 2,
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2023-01-01T10:00:00Z',
    }),
  ],
}

export const invalidDeckPropsWithEmptyTitle = {
  userId: 'user-123',
  title: '',
  description: 'A deck with an empty title',
  type: new DeckType('flashcard'),
}

export const invalidDeckPropsWithNullDescription = {
  userId: 'user-123',
  title: 'Physics',
  description: null as unknown as string,
  type: new DeckType('flashcard'),
}
