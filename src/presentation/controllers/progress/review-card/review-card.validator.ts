import { z } from "zod";

import { DifficultyEnum } from "@/domain/value-objects";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const reviewCardSchema = z
  .object({
    params: z.object({
      cardId: z.string().uuid("Card ID must be a valid UUID"),
      deckId: z.string().uuid("Deck ID must be a valid UUID"),
    }),
    body: z.object({
      difficulty: z.nativeEnum(DifficultyEnum, {
        errorMap: () => ({ message: "Difficulty must be a valid value" }),
      }),
    }),
  })
  .transform((data) => ({
    cardId: data.params.cardId,
    deckId: data.params.deckId,
    difficulty: data.body.difficulty,
  }));

export type ReviewCardValidatorRequest = z.infer<typeof reviewCardSchema>;

export class ReviewCardValidator extends BaseValidator<ReviewCardValidatorRequest> {
  constructor() {
    super(reviewCardSchema);
  }
}
