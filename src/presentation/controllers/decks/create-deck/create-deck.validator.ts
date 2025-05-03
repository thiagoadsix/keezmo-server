import { z } from "zod";

import { StudyModeEnum } from "@/domain/value-objects";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const createDeckSchema = z
  .object({
    user: z.object({
      id: z.string(),
    }),
    body: z.object({
      title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title is too long"),
      description: z.string().max(500, "Description is too long").optional(),
      studyMode: z.nativeEnum(StudyModeEnum),
      cards: z
        .array(
          z.object({
            question: z.string().min(1, "Question is required"),
            answer: z.string().min(1, "Answer is required"),
          })
        )
        .optional(),
    }),
  })
  .transform(({ user, body }) => ({
    userId: user.id,
    ...body,
  }));

export type CreateDeckValidatorRequest = z.infer<typeof createDeckSchema>;

export class CreateDeckValidator extends BaseValidator<CreateDeckValidatorRequest> {
  constructor() {
    super(createDeckSchema);
  }
}
