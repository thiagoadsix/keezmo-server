import { generateIdMock, mockId } from '../../../@support/mocks/shared/utils/generate-id.mock';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Deck } from '@/domain/entities/deck';
import { DeckNotFoundError } from '@/domain/errors/deck/deck-not-found-error';
import { StudyMode } from '@/domain/value-objects';
import { UpdateDeckUseCase } from '@/domain/use-cases/deck/update-deck.usecase';

import { mockDeckRepository } from '../../../@support/mocks/repositories/deck-repository.mock';
import { validDeckProps } from '../../../@support/fixtures/deck.fixtures';

describe('UpdateDeckUseCase', () => {
  let useCase: UpdateDeckUseCase;
  let mockDeck: Deck;
  const userId = 'user-123';
  const initialTitle = 'Math Concepts';
  const initialDescription = 'Basic math concepts for beginners';
  const initialStudyMode = 'flashcard';

  beforeEach(() => {
    useCase = new UpdateDeckUseCase(mockDeckRepository);
    vi.useFakeTimers();
    generateIdMock.mockReturnValue(mockId);

    mockDeck = new Deck(validDeckProps);
    vi.spyOn(mockDeck, 'updateTitle');
    vi.spyOn(mockDeck, 'updateDescription');
    vi.spyOn(mockDeck, 'updateStudyMode');

    mockDeckRepository.findByIdAndUserId.mockResolvedValue(mockDeck);
    mockDeckRepository.save.mockResolvedValue(undefined);

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  describe('Unit Tests', () => {
    it('should update deck title when it changes', async () => {
      const newTitle = 'Advanced Math';
      const request = { deckId: mockId, userId, data: { title: newTitle } };

      const result = await useCase.execute(request);

      expect(mockDeckRepository.findByIdAndUserId).toHaveBeenCalledWith(mockId, userId);
      expect(mockDeck.updateTitle).toHaveBeenCalledWith(newTitle);
      expect(mockDeckRepository.save).toHaveBeenCalledWith(mockDeck);
      expect(result).toBe(mockDeck);
    });

    it('should update deck description when it changes', async () => {
      const newDescription = 'Advanced topics in mathematics';
      const request = {
        deckId: mockId,
        userId,
        data: { description: newDescription },
      };

      const result = await useCase.execute(request);

      expect(mockDeck.updateDescription).toHaveBeenCalledWith(newDescription);
      expect(mockDeckRepository.save).toHaveBeenCalledWith(mockDeck);
      expect(result).toBe(mockDeck);
    });

    it('should update deck study mode when it changes', async () => {
      const newStudyMode = 'multiple_choice';
      const request = {
        deckId: mockId,
        userId,
        data: { studyMode: newStudyMode },
      };

      const result = await useCase.execute(request);

      expect(mockDeck.updateStudyMode).toHaveBeenCalledWith(expect.any(StudyMode));
      expect(mockDeckRepository.save).toHaveBeenCalledWith(mockDeck);
      expect(result).toBe(mockDeck);
    });

    it('should not update fields that are not provided', async () => {
      const request = { deckId: mockId, userId, data: {} };

      await useCase.execute(request);

      expect(mockDeck.updateTitle).not.toHaveBeenCalled();
      expect(mockDeck.updateDescription).not.toHaveBeenCalled();
      expect(mockDeck.updateStudyMode).not.toHaveBeenCalled();
      expect(mockDeckRepository.save).toHaveBeenCalledWith(mockDeck);
    });

    it('should not update fields that are the same as current values', async () => {
      const request = {
        deckId: mockId,
        userId,
        data: {
          title: initialTitle,
          description: initialDescription,
          studyMode: initialStudyMode,
        },
      };

      await useCase.execute(request);

      expect(mockDeck.updateTitle).not.toHaveBeenCalled();
      expect(mockDeck.updateDescription).not.toHaveBeenCalled();
      expect(mockDeck.updateStudyMode).not.toHaveBeenCalled();
      expect(mockDeckRepository.save).toHaveBeenCalledWith(mockDeck);
    });

    it('should update multiple fields when they all change', async () => {
      const newTitle = 'Advanced Math';
      const newDescription = 'Advanced topics in mathematics';
      const newStudyMode = 'multiple_choice';
      const request = {
        deckId: mockId,
        userId,
        data: {
          title: newTitle,
          description: newDescription,
          studyMode: newStudyMode,
        },
      };

      await useCase.execute(request);

      expect(mockDeck.updateTitle).toHaveBeenCalledWith(newTitle);
      expect(mockDeck.updateDescription).toHaveBeenCalledWith(newDescription);
      expect(mockDeck.updateStudyMode).toHaveBeenCalledWith(expect.any(StudyMode));
      expect(mockDeckRepository.save).toHaveBeenCalledWith(mockDeck);
    });

    it('should throw DeckNotFoundError when deck is not found', async () => {
      const request = { deckId: mockId, userId, data: {} };
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(null);

      const promise = useCase.execute(request);

      await expect(promise).rejects.toThrow(DeckNotFoundError);
      expect(mockDeckRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('BDD Scenarios', () => {
    it('Given valid deckId and userId with new title, When execute is called, Then deck title is updated', async () => {
      const newTitle = 'Advanced Math';
      const request = { deckId: mockId, userId, data: { title: newTitle } };

      const result = await useCase.execute(request);

      expect(mockDeck.updateTitle).toHaveBeenCalledWith(newTitle);
      expect(mockDeckRepository.save).toHaveBeenCalledWith(mockDeck);
      expect(result).toBe(mockDeck);
    });

    it('Given valid deckId and userId with no changes, When execute is called, Then no updates are applied', async () => {
      const request = {
        deckId: mockId,
        userId,
        data: {
          title: initialTitle,
          description: initialDescription,
          studyMode: initialStudyMode,
        },
      };

      await useCase.execute(request);

      expect(mockDeck.updateTitle).not.toHaveBeenCalled();
      expect(mockDeck.updateDescription).not.toHaveBeenCalled();
      expect(mockDeck.updateStudyMode).not.toHaveBeenCalled();
      expect(mockDeckRepository.save).toHaveBeenCalledWith(mockDeck);
    });

    it('Given valid deckId and userId with multiple changes, When execute is called, Then all provided fields are updated', async () => {
      const request = {
        deckId: mockId,
        userId,
        data: {
          title: 'New Title',
          description: 'New Description',
          studyMode: 'multiple_choice',
        },
      };

      const result = await useCase.execute(request);

      expect(mockDeck.updateTitle).toHaveBeenCalledWith('New Title');
      expect(mockDeck.updateDescription).toHaveBeenCalledWith('New Description');
      expect(mockDeck.updateStudyMode).toHaveBeenCalledWith(expect.any(StudyMode));
      expect(mockDeckRepository.save).toHaveBeenCalledWith(mockDeck);
      expect(result).toBe(mockDeck);
    });

    it('Given non-existent deck, When execute is called, Then DeckNotFoundError is thrown', async () => {
      const request = {
        deckId: 'non-existent-id',
        userId,
        data: { title: 'New Title' },
      };
      mockDeckRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(useCase.execute(request)).rejects.toThrow(DeckNotFoundError);
    });
  });
});
