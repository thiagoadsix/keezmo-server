import { DeckType } from '@/domain/value-objects/deck-type'

export const validDeckProps = {
  title: 'Math Concepts',
  description: 'Basic math concepts for beginners',
  type: new DeckType('flashcard'),
}

export const validFlashcardDeckProps = {
  title: 'Biology 101',
  description: 'Introduction to biology concepts',
  type: new DeckType('flashcard'),
}

export const validMultipleChoiceDeckProps = {
  title: 'History Quiz',
  description: 'Test your knowledge of world history',
  type: new DeckType('multiple_choice'),
}

export const invalidDeckPropsWithEmptyTitle = {
  title: '',
  description: 'A deck with an empty title',
  type: new DeckType('flashcard'),
}

export const invalidDeckPropsWithNullDescription = {
  title: 'Physics',
  description: null as unknown as string,
  type: new DeckType('flashcard'),
}
