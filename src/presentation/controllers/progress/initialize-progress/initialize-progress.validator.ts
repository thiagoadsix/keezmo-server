import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const initializeProgressSchema = z
  .object({
    params: z.object({
      deckId: z.string().uuid(),
      cardId: z.string().uuid(),
    }),
  })
  .transform((data) => ({
    cardId: data.params.cardId,
    deckId: data.params.deckId,
  }));

export type InitializeProgressValidatorRequest = z.infer<
  typeof initializeProgressSchema
>;

export class InitializeProgressValidator extends BaseValidator<InitializeProgressValidatorRequest> {
  constructor() {
    super(initializeProgressSchema);
  }
}
