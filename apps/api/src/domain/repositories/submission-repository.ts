import type { Submission, SubmissionFile } from '../entities/index.js';
import type { SubmissionStatus } from '@pidec/shared';

export interface CreateSubmissionDTO {
  teamId: string;
  editionId: string;
  submittedBy: string;
  stage: 1 | 2 | 3;
  formData: Record<string, unknown>;
  files?: SubmissionFile[];
  videoLink?: string | null;
  tokenId?: string | null;
}

export interface ISubmissionRepository {
  findById(id: string): Promise<Submission | null>;
  findByTeamStage(teamId: string, editionId: string, stage: 1 | 2 | 3): Promise<Submission | null>;
  listByTeam(teamId: string): Promise<Submission[]>;
  listByStage(editionId: string, stage: 1 | 2 | 3): Promise<Submission[]>;
  listByDepartment(editionId: string, department: string, stage: 1 | 2 | 3): Promise<Submission[]>;
  create(dto: CreateSubmissionDTO): Promise<Submission>;
  setStatus(id: string, status: SubmissionStatus): Promise<void>;
  unlock(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
}
