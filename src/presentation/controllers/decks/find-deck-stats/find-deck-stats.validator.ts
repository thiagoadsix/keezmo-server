import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const findDeckStatsSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  user: z.object({
    id: z.string(),
  }),
});

export type FindDeckStatsValidatorRequest = z.infer<typeof findDeckStatsSchema>;

export class FindDeckStatsValidator extends BaseValidator<FindDeckStatsValidatorRequest> {
  constructor() {
    super(findDeckStatsSchema);
  }
}
