import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const endStudySessionSchema = z.object({
  params: z.object({
    sessionId: z.string().uuid("Session ID must be a valid UUID"),
  }),
  body: z
    .object({
      totalQuestions: z.number().int().positive().optional(),
    })
    .optional(),
});

export type EndStudySessionValidatorRequest = z.infer<
  typeof endStudySessionSchema
>;

export class EndStudySessionValidator extends BaseValidator<EndStudySessionValidatorRequest> {
  constructor() {
    super(endStudySessionSchema);
  }
}
