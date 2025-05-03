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

const updateCardsSchema = z
  .object({
    params: z.object({
      deckId: z.string().min(1, "Deck ID is required"),
    }),
    body: z.object({
      cards: z.array(cardSchema).nonempty("At least one card must be provided"),
    }),
  })
  .transform((data) => ({
    deckId: data.params.deckId,
    cards: data.body.cards,
  }));

export type UpdateCardsValidatorRequest = z.infer<typeof updateCardsSchema>;

export class UpdateCardsValidator extends BaseValidator<UpdateCardsValidatorRequest> {
  constructor() {
    super(updateCardsSchema);
  }
}
