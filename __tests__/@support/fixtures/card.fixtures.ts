import { mockId } from '../mocks/generate-id.mock'

export const validCardProps = {
  deckId: mockId,
  question: 'What is the capital of France?',
  answer: 'Paris',
}

export const validCardPropsWithOptions = {
  deckId: mockId,
  question: 'What is the capital of France?',
  answer: 'Paris',
  options: ['London', 'Paris', 'Berlin', 'Madrid'],
  answerIndex: 1,
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

export const invalidCardPropsWithInvalidAnswerIndex = {
  deckId: mockId,
  question: 'What is the capital of France?',
  answer: 'Paris',
  options: ['London', 'Paris', 'Berlin', 'Madrid'],
  answerIndex: 5,
}
