import { DifficultyEnum } from "@/domain/value-objects";
import { Progress } from "@/domain/entities/progress";

import { validProgressProps } from "./progress.fixtures";

export const newCardProgress = new Progress({
  ...validProgressProps,
  repetitions: 0,
  interval: 0,
  easeFactor: 2.5,
});

export const firstReviewProgress = new Progress({
  ...validProgressProps,
  repetitions: 1,
  interval: 1,
  easeFactor: 2.5,
});

export const secondReviewProgress = new Progress({
  ...validProgressProps,
  repetitions: 2,
  interval: 6,
  easeFactor: 2.6,
});

export const matureCardProgress = new Progress({
  ...validProgressProps,
  repetitions: 5,
  interval: 15,
  easeFactor: 2.2,
});

export const validDifficulties = Object.values(DifficultyEnum);

export const invalidDifficulty = "invalid-difficulty";
