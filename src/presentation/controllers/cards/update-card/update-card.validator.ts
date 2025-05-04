import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const updateCardSchema = z
  .object({
    user: z.object({
      id: z.string(),
    }),
    params: z.object({
      id: z.string().uuid(),
      deckId: z.string().uuid(),
    }),
    body: z
      .object({
        question: z.string().min(1).optional(),
        answer: z.string().min(1).optional(),
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
      }),
  })
  .transform((data) => ({
    id: data.params.id,
    deckId: data.params.deckId,
    userId: data.user.id,
    data: data.body,
  }));

export type UpdateCardValidatorRequest = z.infer<typeof updateCardSchema>;

export class UpdateCardValidator extends BaseValidator<UpdateCardValidatorRequest> {
  constructor() {
    super(updateCardSchema);
  }
}
