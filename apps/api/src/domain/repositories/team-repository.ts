import type { Team, TeamInvite } from '../entities/index.js';
import type { InviteStatus } from '@pidec/shared';

export interface CreateTeamDTO {
  editionId: string;
  name: string;
  department: string;
  leaderId: string;
}

export interface CreateInviteDTO {
  teamId: string;
  inviteeId: string;
  invitedBy: string;
  expiresAt: Date;
}

export interface ITeamRepository {
  findById(id: string): Promise<Team | null>;
  findByName(editionId: string, name: string): Promise<Team | null>;
  findByLeader(leaderId: string): Promise<Team | null>;
  countMembers(teamId: string): Promise<number>;
  listMembers(teamId: string): Promise<Array<{ id: string; name: string; email: string }>>;
  create(dto: CreateTeamDTO): Promise<Team>;
  rename(teamId: string, name: string): Promise<Team>;
  setLeader(teamId: string, leaderId: string): Promise<void>;
  setStatus(teamId: string, status: 'active' | 'disqualified' | 'under_review', extras?: { atStage?: 1 | 2 | 3; reason?: string }): Promise<void>;
  setStage(teamId: string, stage: 1 | 2 | 3): Promise<void>;
  markRepresentative(teamId: string, isRepresentative: boolean): Promise<void>;
  softDelete(teamId: string): Promise<void>;
}

export interface ITeamInviteRepository {
  findById(id: string): Promise<TeamInvite | null>;
  findPendingFor(inviteeId: string): Promise<TeamInvite[]>;
  findPendingByTeam(teamId: string): Promise<TeamInvite[]>;
  create(dto: CreateInviteDTO): Promise<TeamInvite>;
  setStatus(id: string, status: InviteStatus): Promise<void>;
  expirePending(now: Date): Promise<number>;
}
