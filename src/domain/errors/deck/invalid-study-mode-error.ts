import { StudyModeEnum } from "@/domain/value-objects";

import { DomainError } from "@/domain/errors/domain-error";

export class InvalidStudyModeError extends DomainError {
  constructor(studyMode: string) {
    super(
      `The study mode "${studyMode}" is invalid. Valid modes are: ${StudyModeEnum.MULTIPLE_CHOICE}, ${StudyModeEnum.FLASHCARD}.`
    );
    this.name = "InvalidStudyModeError";
  }
}
