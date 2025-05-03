import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const findDeckByIdAndUserSchema = z
  .object({
    params: z.object({
      id: z.string().uuid(),
    }),
    user: z.object({
      id: z.string(),
    }),
  })
  .transform(({ params, user }) => ({
    id: params.id,
    userId: user.id,
  }));

export type FindDeckByIdAndUserValidatorRequest = z.infer<
  typeof findDeckByIdAndUserSchema
>;

export class FindDeckByIdAndUserValidator extends BaseValidator<FindDeckByIdAndUserValidatorRequest> {
  constructor() {
    super(findDeckByIdAndUserSchema);
  }
}
