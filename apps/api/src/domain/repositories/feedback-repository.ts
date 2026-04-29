import type { Feedback } from '../entities/index.js';
import type { FeedbackOutcome } from '@pidec/shared';

export interface UpsertFeedbackDTO {
  submissionId: string;
  enteredByAdmin: string;
  scores: Record<string, number>;
  comments: Record<string, string>;
  totalScore: number;
  outcome: FeedbackOutcome;
  evaluatorName: string;
  evaluationDate?: string;
}

export interface IFeedbackRepository {
  findBySubmission(submissionId: string): Promise<Feedback | null>;
  upsert(dto: UpsertFeedbackDTO): Promise<Feedback>;
  publish(submissionIds: string[], publishedBy: string): Promise<number>;
  softDelete(id: string): Promise<void>;
}
