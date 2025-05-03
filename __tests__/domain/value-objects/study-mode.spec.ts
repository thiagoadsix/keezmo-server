import { describe, expect, it } from 'vitest';

import { StudyMode, StudyModeEnum } from '@/domain/value-objects';
import { InvalidStudyModeError } from '@/domain/errors/deck/invalid-study-mode-error';

describe('StudyMode', () => {
  describe('constructor', () => {
    it('should create a valid StudyMode with flashcard study mode', () => {
      const studyMode = new StudyMode('flashcard');

      expect(studyMode).toBeInstanceOf(StudyMode);
      expect(studyMode.getValue()).toBe(StudyModeEnum.FLASHCARD);
    });

    it('should create a valid StudyMode with multiple_choice study mode', () => {
      const studyMode = new StudyMode('multiple_choice');

      expect(studyMode).toBeInstanceOf(StudyMode);
      expect(studyMode.getValue()).toBe(StudyModeEnum.MULTIPLE_CHOICE);
    });

    it('should throw InvalidStudyModeError for invalid study mode', () => {
      expect(() => new StudyMode('invalid-study-mode')).toThrow(InvalidStudyModeError);
      expect(() => new StudyMode('invalid-study-mode')).toThrow(
        `The study mode "invalid-study-mode" is invalid. Valid modes are: ${StudyModeEnum.MULTIPLE_CHOICE}, ${StudyModeEnum.FLASHCARD}.`
      );
    });
  });

  describe('getValue', () => {
    it('should return the correct study mode value', () => {
      const flashcardStudyMode = new StudyMode('flashcard');
      const multipleChoiceStudyMode = new StudyMode('multiple_choice');

      expect(flashcardStudyMode.getValue()).toBe(StudyModeEnum.FLASHCARD);
      expect(multipleChoiceStudyMode.getValue()).toBe(StudyModeEnum.MULTIPLE_CHOICE);
    });
  });
});
