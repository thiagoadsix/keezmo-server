import { StudySession } from '@/domain/entities/study-session'
import { StudySessionRepository } from '@/domain/interfaces/repositories'
import { StudyModeEnum } from '@/domain/value-objects'

interface CreateStudySessionRequest {
  deckId: string
  studyMode: StudyModeEnum
  totalQuestions: number
  startTime: string
  endTime: string
}

type CreateStudySessionResponse = void

export class CreateStudySessionUseCase {
  constructor(
    private readonly studySessionRepository: StudySessionRepository,
  ) {}

  public async execute(
    request: CreateStudySessionRequest,
  ): Promise<CreateStudySessionResponse> {
    console.log('Starting CreateStudySessionUseCase execution', {
      deckId: request.deckId,
      studyMode: request.studyMode,
      totalQuestions: request.totalQuestions,
    })

    const studySessionProps = {
      deckId: request.deckId,
      startTime: request.startTime,
      endTime: request.endTime,
      studyMode: request.studyMode,
    }

    const studySession = new StudySession(studySessionProps)

    await this.studySessionRepository.save(studySession)

    console.log('Study session created successfully', {
      id: studySession.id,
      deckId: studySession.deckId,
      studyMode: studySession.studyMode,
    })
  }
}
