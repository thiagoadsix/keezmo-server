import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const createCardSchema = z
  .object({
    params: z.object({
      deckId: z.string().uuid(),
    }),
    user: z.object({
      id: z.string(),
    }),
    body: z.object({
      question: z.string().min(1),
      answer: z.string().min(1),
    }),
  })
  .transform((data) => ({
    deckId: data.params.deckId,
    userId: data.user.id,
    data: data.body,
  }));

export type CreateCardValidatorRequest = z.infer<typeof createCardSchema>;

export class CreateCardValidator extends BaseValidator<CreateCardValidatorRequest> {
  constructor() {
    super(createCardSchema);
  }
}
