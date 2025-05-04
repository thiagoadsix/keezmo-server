import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const findCardsByDeckIdSchema = z
  .object({
    params: z.object({
      deckId: z.string().uuid(),
    }),
    user: z.object({
      id: z.string(),
    }),
  })
  .transform((data) => ({
    deckId: data.params.deckId,
    userId: data.user.id,
  }));

export type FindCardsByDeckIdValidatorRequest = z.infer<
  typeof findCardsByDeckIdSchema
>;

export class FindCardsByDeckIdValidator extends BaseValidator<FindCardsByDeckIdValidatorRequest> {
  constructor() {
    super(findCardsByDeckIdSchema);
  }
}
