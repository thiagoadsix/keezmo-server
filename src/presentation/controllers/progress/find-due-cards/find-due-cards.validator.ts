import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const findDueCardsSchema = z
  .object({
    params: z.object({
      deckId: z.string().uuid(),
    }),
    query: z.object({
      date: z
        .string()
        .refine(
          (val) => {
            return (
              /^\d{4}-\d{2}-\d{2}$/.test(val) ||
              z.string().datetime().safeParse(val).success
            );
          },
          {
            message: "Invalid date format. Expected YYYY-MM-DD or ISO datetime",
          }
        )
        .transform((val) => {
          if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
            return new Date(val);
          }
          return new Date(val);
        })
        .optional(),
    }),
  })
  .transform((data) => ({
    date: data.query.date,
    deckId: data.params.deckId,
  }));

export type FindDueCardsValidatorRequest = z.infer<typeof findDueCardsSchema>;

export class FindDueCardsValidator extends BaseValidator<FindDueCardsValidatorRequest> {
  constructor() {
    super(findDueCardsSchema);
  }
}
