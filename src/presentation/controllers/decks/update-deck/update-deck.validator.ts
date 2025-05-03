import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const updateDeckSchema = z
  .object({
    params: z.object({
      id: z.string().uuid(),
    }),
    user: z.object({
      id: z.string(),
    }),
    body: z.object({
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      studyMode: z.string().optional(),
    }),
  })
  .transform(({ params, user, body }) => ({
    id: params.id,
    userId: user.id,
    data: {
      title: body.title,
      description: body.description,
      studyMode: body.studyMode,
    },
  }));

export type UpdateDeckValidatorRequest = z.infer<typeof updateDeckSchema>;

export class UpdateDeckValidator extends BaseValidator<UpdateDeckValidatorRequest> {
  constructor() {
    super(updateDeckSchema);
  }
}
