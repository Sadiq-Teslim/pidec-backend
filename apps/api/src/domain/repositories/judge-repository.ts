import type { Judge, JudgeScore } from '../entities/index.js';
import type { JudgeStageScope } from '@pidec/shared';

export interface CreateJudgeDTO {
  authUserId: string;
  editionId: string;
  name: string;
  email: string;
  stageScope: JudgeStageScope;
  assignedDepartments: string[];
  createdBy: string;
}

export interface UpsertJudgeScoreDTO {
  submissionId: string;
  judgeId: string;
  scores: Record<string, number>;
  comments: Record<string, string>;
  totalScore?: number;
  isRepresentativePick?: boolean;
}

export interface IJudgeRepository {
  findById(id: string): Promise<Judge | null>;
  findByEdition(editionId: string): Promise<Judge[]>;
  create(dto: CreateJudgeDTO): Promise<Judge>;
  deactivate(id: string, deactivatedBy: string): Promise<void>;
}

export interface IJudgeScoreRepository {
  find(judgeId: string, submissionId: string): Promise<JudgeScore | null>;
  listBySubmission(submissionId: string): Promise<JudgeScore[]>;
  listByJudge(judgeId: string): Promise<JudgeScore[]>;
  upsert(dto: UpsertJudgeScoreDTO): Promise<JudgeScore>;
}
