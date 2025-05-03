import { StudyModeEnum } from "@/domain/value-objects";

import { StudySession } from "@/domain/entities/study-session";
import { StudySessionRepository } from "@/domain/interfaces/repositories";

interface StartStudySessionRequest {
  deckId: string;
  userId: string;
  studyMode: StudyModeEnum;
}

interface StartStudySessionResponse {
  sessionId: string;
}

export class StartStudySessionUseCase {
  constructor(
    private readonly studySessionRepository: StudySessionRepository
  ) {}

  public async execute(
    request: StartStudySessionRequest
  ): Promise<StartStudySessionResponse> {
    console.log("Starting a new study session", {
      deckId: request.deckId,
      studyMode: request.studyMode,
    });

    const startTime = new Date().toISOString();

    const studySessionProps = {
      deckId: request.deckId,
      userId: request.userId,
      startTime,
      studyMode: request.studyMode,
    };

    const studySession = new StudySession(studySessionProps);

    await this.studySessionRepository.save(studySession);

    console.log("Study session started successfully", {
      id: studySession.id,
      deckId: studySession.deckId,
      studyMode: studySession.studyMode,
      startTime: studySession.startTime,
    });

    return {
      sessionId: studySession.id,
    };
  }
}
