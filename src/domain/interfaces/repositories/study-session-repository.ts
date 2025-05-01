import { StudySession } from '@/domain/entities/study-session';

export interface StudySessionRepository {
  findById(id: string): Promise<StudySession | null>;
  findByUserId(userId: string): Promise<StudySession[]>;
  save(studySession: StudySession): Promise<void>;
}
