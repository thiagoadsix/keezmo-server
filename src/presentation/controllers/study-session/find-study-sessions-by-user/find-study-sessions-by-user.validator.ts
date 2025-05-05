import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const findStudySessionsByUserSchema = z
  .object({
    user: z.object({
      id: z.string(),
    }),
  })
  .transform((data) => ({
    userId: data.user.id,
  }));

export type FindStudySessionsByUserValidatorRequest = z.infer<
  typeof findStudySessionsByUserSchema
>;

export class FindStudySessionsByUserValidator extends BaseValidator<FindStudySessionsByUserValidatorRequest> {
  constructor() {
    super(findStudySessionsByUserSchema);
  }
}
