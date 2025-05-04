import { z } from "zod";

import { StudyModeEnum } from "@/domain/value-objects";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const startStudySessionSchema = z
  .object({
    user: z.object({
      id: z.string(),
    }),
    body: z.object({
      deckId: z.string().uuid("Deck ID must be a valid UUID"),
      studyMode: z.nativeEnum(StudyModeEnum, {
        errorMap: () => ({ message: "Study mode must be a valid value" }),
      }),
    }),
  })
  .transform((data) => ({
    userId: data.user.id,
    deckId: data.body.deckId,
    studyMode: data.body.studyMode,
  }));

export type StartStudySessionValidatorRequest = z.infer<
  typeof startStudySessionSchema
>;

export class StartStudySessionValidator extends BaseValidator<StartStudySessionValidatorRequest> {
  constructor() {
    super(startStudySessionSchema);
  }
}
