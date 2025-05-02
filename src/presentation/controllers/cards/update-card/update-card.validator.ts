import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const updateCardSchema = z.object({
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
});

export type UpdateCardValidatorRequest = z.infer<typeof updateCardSchema>;

export class UpdateCardValidator extends BaseValidator<UpdateCardValidatorRequest> {
  constructor() {
    super(updateCardSchema);
  }
}
