import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const deleteCardSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
    deckId: z.string().uuid(),
  }),
  user: z.object({
    id: z.string(),
  }),
});

export type DeleteCardValidatorRequest = z.infer<typeof deleteCardSchema>;

export class DeleteCardValidator extends BaseValidator<DeleteCardValidatorRequest> {
  constructor() {
    super(deleteCardSchema);
  }
}
