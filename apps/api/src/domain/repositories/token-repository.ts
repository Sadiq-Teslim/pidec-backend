import type { Token } from '../entities/index.js';

export interface CreateTokenDTO {
  editionId: string;
  department: string;
  tokenString: string;
  expiresAt?: Date;
  createdBy: string;
}

export interface ITokenRepository {
  findActive(editionId: string, department: string): Promise<Token | null>;
  findByString(tokenString: string): Promise<Token | null>;
  listByEdition(editionId: string): Promise<Token[]>;
  create(dto: CreateTokenDTO): Promise<Token>;
  regenerate(editionId: string, department: string, newTokenString: string, by: string): Promise<Token>;
  recordUse(id: string): Promise<void>;
}
