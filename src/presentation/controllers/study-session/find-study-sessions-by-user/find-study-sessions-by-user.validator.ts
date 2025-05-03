import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const findStudySessionsByUserSchema = z
  .object({
    params: z.object({
      userId: z.string().uuid("User ID must be a valid UUID"),
    }),
  })
  .transform((data) => ({
    userId: data.params.userId,
  }));

export type FindStudySessionsByUserValidatorRequest = z.infer<
  typeof findStudySessionsByUserSchema
>;

export class FindStudySessionsByUserValidator extends BaseValidator<FindStudySessionsByUserValidatorRequest> {
  constructor() {
    super(findStudySessionsByUserSchema);
  }
}
