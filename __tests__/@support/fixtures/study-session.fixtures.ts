import { StudyModeEnum } from '@/domain/value-objects';

import { mockId } from '../mocks/shared/utils/generate-id.mock';

export const validFlashcardSessionProps = {
  id: mockId,
  userId: mockId,
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyMode: StudyModeEnum.FLASHCARD,
};

export const invalidSessionPropsWithoutDeckId = {
  id: mockId,
  userId: mockId,
  deckId: '',
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyMode: StudyModeEnum.FLASHCARD,
};

export const invalidSessionPropsWithoutStartTime = {
  id: mockId,
  userId: mockId,
  deckId: mockId,
  startTime: '',
  endTime: '2023-05-15T10:30:00Z',
  studyMode: StudyModeEnum.FLASHCARD,
};

export const invalidSessionPropsWithInvalidStudyType = {
  id: mockId,
  userId: mockId,
  deckId: mockId,
  startTime: '2023-05-15T10:00:00Z',
  endTime: '2023-05-15T10:30:00Z',
  studyMode: 'invalid-type' as StudyModeEnum,
};
