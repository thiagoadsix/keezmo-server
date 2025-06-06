import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const deleteDeckSchema = z
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

export type DeleteDeckValidatorRequest = z.infer<typeof deleteDeckSchema>;

export class DeleteDeckValidator extends BaseValidator<DeleteDeckValidatorRequest> {
  constructor() {
    super(deleteDeckSchema);
  }
}
