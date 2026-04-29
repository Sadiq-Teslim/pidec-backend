import type { User, StudentLevel } from '../entities/index.js';
import type { VerificationStatus, VerificationMethod } from '@pidec/shared';

export interface CreateUserDTO {
  authUserId: string;
  name: string;
  email: string;
  matricNumber: string;
  department: string;
  level: StudentLevel;
}

export interface UpdateVerificationDTO {
  status: VerificationStatus;
  method: VerificationMethod;
  attemptIncrement?: boolean;
}

/**
 * Domain port for user persistence. Infrastructure implementations live in
 * /infrastructure/db/. Use cases depend on this interface, not the impl.
 */
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByMatricNumber(matric: string): Promise<User | null>;
  create(dto: CreateUserDTO): Promise<User>;
  updateVerification(userId: string, update: UpdateVerificationDTO): Promise<User>;
  setTeam(userId: string, teamId: string | null): Promise<void>;
  suspend(userId: string, reason: string): Promise<void>;
  unsuspend(userId: string): Promise<void>;
  softDelete(userId: string): Promise<void>;
}
