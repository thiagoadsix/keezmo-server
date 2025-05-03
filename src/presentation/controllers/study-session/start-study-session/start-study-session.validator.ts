import { z } from "zod";

import { StudyModeEnum } from "@/domain/value-objects";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const startStudySessionSchema = z.object({
  body: z.object({
    deckId: z.string().uuid("Deck ID must be a valid UUID"),
    // TODO: maybe we could move it to user object
    userId: z.string().uuid("User ID must be a valid UUID"),
    studyMode: z.nativeEnum(StudyModeEnum, {
      errorMap: () => ({ message: "Study mode must be a valid value" }),
    }),
  }),
});

export type StartStudySessionValidatorRequest = z.infer<
  typeof startStudySessionSchema
>;

export class StartStudySessionValidator extends BaseValidator<StartStudySessionValidatorRequest> {
  constructor() {
    super(startStudySessionSchema);
  }
}
