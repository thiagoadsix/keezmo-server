import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const cardSchema = z
  .object({
    id: z.string().min(1, "Card ID is required"),
    question: z.string().min(1, "Question is required").optional(),
    answer: z.string().min(1, "Answer is required").optional(),
  })
  .refine((card) => card.question !== undefined || card.answer !== undefined, {
    message: "At least question or answer must be provided for update",
    path: ["question", "answer"],
  });

const updateCardsBatchSchema = z
  .object({
    user: z.object({
      id: z.string().min(1, "User ID is required"),
    }),
    params: z.object({
      deckId: z.string().min(1, "Deck ID is required"),
    }),
    body: z.array(cardSchema).nonempty("At least one card must be provided"),
  })
  .transform((data) => ({
    deckId: data.params.deckId,
    userId: data.user.id,
    cards: data.body,
  }));

export type UpdateCardsBatchValidatorRequest = z.infer<
  typeof updateCardsBatchSchema
>;

export class UpdateCardsBatchValidator extends BaseValidator<UpdateCardsBatchValidatorRequest> {
  constructor() {
    super(updateCardsBatchSchema);
  }
}
