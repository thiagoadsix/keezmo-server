import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const findDecksByUserSchema = z.object({
  user: z.object({
    id: z.string(),
  }),
});

export type FindDecksByUserValidatorRequest = z.infer<
  typeof findDecksByUserSchema
>;

export class FindDecksByUserValidator extends BaseValidator<FindDecksByUserValidatorRequest> {
  constructor() {
    super(findDecksByUserSchema);
  }
}
