import { Progress } from '@/domain/entities/progress';

import { DifficultyEnum } from '../value-objects';
import { InvalidDifficultyError } from '../errors/invalid-difficulty-error';

const DIFFICULTY_TO_QUALITY: Record<string, number> = {
  again: 1,
  hard: 3,
  normal: 4,
  easy: 5,
};

export class SM2SchedulerService {
  private repetitions: number = 0;
  private interval: number = 0;
  private easeFactor: number = 2.5;

  public static execute({ progress, difficulty }: { progress: Progress; difficulty: DifficultyEnum }): {
    updated: Progress;
  } {
    const quality = DIFFICULTY_TO_QUALITY[difficulty];

    if (quality === undefined) {
      throw new InvalidDifficultyError(difficulty);
    }

    const scheduler = new SM2SchedulerService();
    const { repetitions, interval, easeFactor } = scheduler
      .withProgress(progress)
      .calculateNewValues(quality)
      .adjustEaseFactor(quality)
      .getResult();

    const nextReview = new Date();
    nextReview.setUTCDate(nextReview.getUTCDate() + interval);

    const updated = new Progress({
      ...progress,
      repetitions,
      interval,
      easeFactor,
      lastReviewed: new Date().toISOString(),
      nextReview: nextReview.toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { updated };
  }

  private withProgress(progress: Progress): SM2SchedulerService {
    this.repetitions = progress.repetitions;
    this.interval = progress.interval;
    this.easeFactor = progress.easeFactor;
    return this;
  }

  private calculateNewValues(quality: number): SM2SchedulerService {
    if (quality < 3) {
      this.repetitions = 0;
      this.interval = 1;
    } else {
      this.repetitions += 1;

      if (this.repetitions === 1) {
        this.interval = 1;
      } else if (this.repetitions === 2) {
        this.interval = 6;
      } else {
        this.interval = Math.round(this.interval * this.easeFactor);
      }
    }
    return this;
  }

  private adjustEaseFactor(quality: number): SM2SchedulerService {
    this.easeFactor = Math.max(1.3, this.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    return this;
  }

  private getResult(): {
    repetitions: number;
    interval: number;
    easeFactor: number;
  } {
    return {
      repetitions: this.repetitions,
      interval: this.interval,
      easeFactor: this.easeFactor,
    };
  }
}
