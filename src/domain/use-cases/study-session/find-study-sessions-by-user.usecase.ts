import { StudySession } from '@/domain/entities/study-session'
import { StudySessionRepository } from '@/domain/interfaces/repositories'

interface FindStudySessionsByUserRequest {
  userId: string
}

type FindStudySessionsByUserResponse = StudySession[]

export class FindStudySessionsByUserUseCase {
  constructor(
    private readonly studySessionRepository: StudySessionRepository,
  ) {}

  async execute(
    request: FindStudySessionsByUserRequest,
  ): Promise<FindStudySessionsByUserResponse> {
    console.log(
      `Starting FindStudySessionsByUserUseCase for userId: ${request.userId}`,
    )

    const studySessions = await this.studySessionRepository.findByUserId(
      request.userId,
    )

    console.log(
      `Found ${studySessions.length} study sessions for user ${request.userId}`,
    )
    return studySessions
  }
}
