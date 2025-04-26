import { StudySessionNotFoundError } from '@/domain/errors/study-session/study-session-not-found-error'
import { StudySessionRepository } from '@/domain/interfaces/study-session-repository'

interface EndStudySessionRequest {
  sessionId: string
  totalQuestions?: number
}

interface EndStudySessionResponse {
  durationSeconds: number
}

export class EndStudySessionUseCase {
  constructor(
    private readonly studySessionRepository: StudySessionRepository,
  ) {}

  public async execute(
    request: EndStudySessionRequest,
  ): Promise<EndStudySessionResponse> {
    console.log('Ending study session', {
      sessionId: request.sessionId,
    })

    const studySession = await this.studySessionRepository.findById(
      request.sessionId,
    )

    if (!studySession) {
      throw new StudySessionNotFoundError(request.sessionId)
    }

    const endTime = new Date().toISOString()
    studySession.setEndTime(endTime)

    await this.studySessionRepository.save(studySession)

    const startDate = new Date(studySession.startTime)
    const endDate = new Date(endTime)
    const durationMs = endDate.getTime() - startDate.getTime()
    const durationSeconds = Math.floor(durationMs / 1000)

    console.log('Study session ended successfully', {
      id: studySession.id,
      deckId: studySession.deckId,
      duration: `${durationSeconds} seconds`,
      totalQuestions: request.totalQuestions || 'not specified',
    })

    return {
      durationSeconds,
    }
  }
}
