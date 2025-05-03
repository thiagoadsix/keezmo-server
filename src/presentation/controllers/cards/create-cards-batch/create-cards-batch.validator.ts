import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const createCardsBatchSchema = z
  .object({
    params: z.object({
      deckId: z.string().uuid(),
    }),
    user: z.object({
      id: z.string(),
    }),
    body: z.object({
      cards: z.array(
        z.object({
          question: z.string().min(1),
          answer: z.string().min(1),
        })
      ),
    }),
  })
  .transform((data) => ({
    deckId: data.params.deckId,
    userId: data.user.id,
    cards: data.body.cards,
  }));

export type CreateCardsBatchValidatorRequest = z.infer<
  typeof createCardsBatchSchema
>;

export class CreateCardsBatchValidator extends BaseValidator<CreateCardsBatchValidatorRequest> {
  constructor() {
    super(createCardsBatchSchema);
  }
}
