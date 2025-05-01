import { z } from "zod";

import { StudyModeEnum } from "@/domain/value-objects";

import { BaseValidator } from "../base.validator";

const createDeckSchema = z.object({
  userId: z.string(),
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
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
});

export type CreateDeckValidatorRequest = z.infer<typeof createDeckSchema>;

export class CreateDeckValidator extends BaseValidator<CreateDeckValidatorRequest> {
  constructor() {
    super(createDeckSchema);
  }
}
