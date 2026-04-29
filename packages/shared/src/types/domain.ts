import type { Department } from '../constants/departments.js';
import type {
  FeedbackOutcome,
  InviteStatus,
  JudgeStageScope,
  SubmissionStatus,
  TeamStatus,
  UserRole,
  VerificationMethod,
  VerificationStatus,
} from '../constants/roles.js';
import type { NotificationType } from '../constants/notification-types.js';

export type StudentLevel = 100 | 200 | 300 | 400 | 500;

export interface Edition {
  id: string;
  name: string;
  theme: string | null;
  activeStage: 0 | 1 | 2 | 3;
  signupOpen: boolean;
  teamManagementLocked: boolean;
  submissionWindowOpen: boolean;
  isActive: boolean;
  announcementBanner: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  matricNumber: string;
  department: Department | string;
  level: StudentLevel;
  verificationStatus: VerificationStatus;
  verificationMethod: VerificationMethod | null;
  verificationTimestamp: string | null;
  verificationAttempts: number;
  lastVerificationAttemptAt: string | null;
  isSuspended: boolean;
  suspendedAt: string | null;
  suspensionReason: string | null;
  teamId: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Team {
  id: string;
  editionId: string;
  name: string;
  department: Department | string;
  leaderId: string;
  currentStage: 1 | 2 | 3;
  status: TeamStatus;
  disqualifiedAtStage: 1 | 2 | 3 | null;
  disqualifiedAt: string | null;
  disqualifiedReason: string | null;
  isStage2Representative: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface TeamInvite {
  id: string;
  teamId: string;
  inviteeId: string;
  invitedBy: string;
  status: InviteStatus;
  expiresAt: string;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SubmissionFile {
  url: string;
  filename: string;
  size_bytes: number;
  mimetype: string;
  uploaded_at: string;
}

export interface Submission {
  id: string;
  teamId: string;
  editionId: string;
  submittedBy: string;
  stage: 1 | 2 | 3;
  formData: Record<string, unknown>;
  files: SubmissionFile[];
  videoLink: string | null;
  status: SubmissionStatus;
  isLocked: boolean;
  tokenId: string | null;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Feedback {
  id: string;
  submissionId: string;
  scores: Record<string, number>;
  comments: Record<string, string>;
  totalScore: number | null;
  outcome: FeedbackOutcome | null;
  published: boolean;
  publishedAt: string | null;
  publishedBy: string | null;
  enteredByAdmin: string;
  evaluatorName: string | null;
  evaluationDate: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Judge {
  id: string;
  editionId: string;
  name: string;
  email: string;
  stageScope: JudgeStageScope;
  assignedDepartments: string[];
  isActive: boolean;
  createdBy: string;
  deactivatedAt: string | null;
  deactivatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JudgeScore {
  id: string;
  submissionId: string;
  judgeId: string;
  scores: Record<string, number>;
  comments: Record<string, string>;
  totalScore: number | null;
  isRepresentativePick: boolean;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Token {
  id: string;
  editionId: string;
  department: string;
  tokenString: string;
  expiresAt: string | null;
  useCount: number;
  lastUsedAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Stage2Checkpoint {
  id: string;
  editionId: string;
  stage: 2;
  title: string;
  description: string | null;
  dueAt: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface LandingAsset {
  id: string;
  editionId: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface LandingFaq {
  id: string;
  editionId: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface LandingData {
  edition: Edition;
  sponsors: LandingAsset[];
  partners: LandingAsset[];
  faqs: LandingFaq[];
  departments: string[];
  announcementBanner: string | null;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl: string | null;
  metadata: Record<string, unknown>;
  read: boolean;
  readAt: string | null;
  createdAt: string;
  deletedAt: string | null;
}
