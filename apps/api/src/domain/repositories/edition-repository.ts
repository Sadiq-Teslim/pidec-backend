import type { Edition } from '../entities/index.js';

export interface UpdateEditionDTO {
  name?: string;
  theme?: string | null;
  activeStage?: 0 | 1 | 2 | 3;
  signupOpen?: boolean;
  teamManagementLocked?: boolean;
  submissionWindowOpen?: boolean;
  announcementBanner?: string | null;
}

export interface IEditionRepository {
  getActive(): Promise<Edition | null>;
  findById(id: string): Promise<Edition | null>;
  update(id: string, dto: UpdateEditionDTO): Promise<Edition>;
}
