import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const findDecksStatsSchema = z
  .object({
    user: z.object({
      id: z.string(),
    }),
  })
  .transform(({ user }) => ({
    userId: user.id,
  }));

export type FindDecksStatsValidatorRequest = z.infer<typeof findDecksStatsSchema>;

export class FindDecksStatsValidator extends BaseValidator<FindDecksStatsValidatorRequest> {
  constructor() {
    super(findDecksStatsSchema);
  }
}
