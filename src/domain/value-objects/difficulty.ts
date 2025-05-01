import { InvalidStudySessionDifficultyError } from '../errors/study-session';

export enum DifficultyEnum {
  AGAIN = 'again',
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard',
}

export class Difficulty {
  private readonly value: DifficultyEnum;

  constructor(difficulty: string) {
    if (!this.isValidDifficulty(difficulty)) {
      throw new InvalidStudySessionDifficultyError(difficulty);
    }
    this.value = difficulty as DifficultyEnum;
  }

  private isValidDifficulty(difficulty: string) {
    return Object.values(DifficultyEnum).includes(difficulty as DifficultyEnum);
  }

  public getValue(): DifficultyEnum {
    return this.value;
  }
}
