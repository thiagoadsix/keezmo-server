import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";

const updateDeckSchema = z.object({
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
});

export type UpdateDeckValidatorRequest = z.infer<typeof updateDeckSchema>;

export class UpdateDeckValidator extends BaseValidator<UpdateDeckValidatorRequest> {
  constructor() {
    super(updateDeckSchema);
  }
}
