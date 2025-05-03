import { ProgressProps } from "@/domain/entities/progress";

export const validProgressProps: ProgressProps = {
  cardId: "123e4567-e89b-12d3-a456-426614174001",
  deckId: "123e4567-e89b-12d3-a456-426614174002",
  repetitions: 1,
  interval: 1,
  easeFactor: 2.5,
  nextReview: "2023-01-02T12:00:00Z",
  lastReviewed: "2023-01-01T12:00:00Z",
};

export const validProgressPropsMinimal: ProgressProps = {
  cardId: "123e4567-e89b-12d3-a456-426614174001",
  deckId: "123e4567-e89b-12d3-a456-426614174002",
};

export const invalidProgressPropsWithoutCardId: Omit<ProgressProps, "cardId"> =
  {
    deckId: "123e4567-e89b-12d3-a456-426614174002",
  };

export const invalidProgressPropsWithoutDeckId: Omit<ProgressProps, "deckId"> =
  {
    cardId: "123e4567-e89b-12d3-a456-426614174001",
  };
