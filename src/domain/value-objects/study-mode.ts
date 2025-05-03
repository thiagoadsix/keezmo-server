import { InvalidStudyModeError } from '@/domain/errors/deck/invalid-study-mode-error';

export enum StudyModeEnum {
  FLASHCARD = 'flashcard',
  MULTIPLE_CHOICE = 'multiple_choice',
}

export class StudyMode {
  private readonly value: StudyModeEnum;

  constructor(studyMode: string) {
    if (!this.isValidStudyMode(studyMode)) {
      throw new InvalidStudyModeError(studyMode);
    }
    this.value = studyMode as StudyModeEnum;
  }

  private isValidStudyMode(studyMode: string): boolean {
    return Object.values(StudyModeEnum).includes(studyMode as StudyModeEnum);
  }

  public getValue(): StudyModeEnum {
    return this.value;
  }
}
