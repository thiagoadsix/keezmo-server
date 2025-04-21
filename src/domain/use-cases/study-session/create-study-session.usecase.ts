import { StudySession, QuestionMetadata } from '@/domain/entities/study-session'
import { StudySessionRepository } from '@/domain/interfaces/study-session-repository'
import { StudyType } from '@/domain/types/study.type'
import { Rating } from '@/domain/value-objects'

interface CreateStudySessionRequest {
  deckId: string
  studyType: StudyType
  totalQuestions: number
  startTime: string
  endTime: string

  ratings?: Array<{
    questionId: string
    rating: string
  }>

  hits?: number
  misses?: number
  questionsMetadata?: QuestionMetadata[]
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
      studyType: request.studyType,
      totalQuestions: request.totalQuestions,
    })

    const studySessionProps = {
      deckId: request.deckId,
      startTime: request.startTime,
      endTime: request.endTime,
      studyType: request.studyType,
    }

    if (request.studyType === 'flashcard' && request.ratings) {
      Object.assign(studySessionProps, {
        ratings: request.ratings.map((r) => ({
          questionId: r.questionId,
          rating: new Rating(r.rating),
        })),
      })
    } else if (request.studyType === 'multiple_choice') {
      Object.assign(studySessionProps, {
        hits: request.hits || 0,
        misses: request.misses || 0,
        questionsMetadata: request.questionsMetadata || [],
      })
    }

    const studySession = new StudySession(studySessionProps)

    await this.studySessionRepository.save(studySession)

    console.log('Study session created successfully', {
      id: studySession.id,
      deckId: studySession.deckId,
      studyType: studySession.studyType,
    })
  }
}
