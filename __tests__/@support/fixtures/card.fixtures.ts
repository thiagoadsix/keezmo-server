import { mockId } from '../mocks/shared/utils/generate-id.mock'

export const validCardProps = {
  id: mockId,
  deckId: mockId,
  question: 'What is the capital of France?',
  answer: 'Paris',
}

export const invalidCardPropsWithEmptyQuestion = {
  deckId: mockId,
  question: '',
  answer: 'Paris',
}

export const invalidCardPropsWithEmptyAnswer = {
  deckId: mockId,
  question: 'What is the capital of France?',
  answer: '',
}
