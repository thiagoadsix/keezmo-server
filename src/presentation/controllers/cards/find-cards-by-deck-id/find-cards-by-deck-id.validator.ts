import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const findCardsByDeckIdSchema = z.object({
  params: z.object({
    deckId: z.string().uuid(),
  }),
});

export type FindCardsByDeckIdValidatorRequest = z.infer<
  typeof findCardsByDeckIdSchema
>;

export class FindCardsByDeckIdValidator extends BaseValidator<FindCardsByDeckIdValidatorRequest> {
  constructor() {
    super(findCardsByDeckIdSchema);
  }
}
