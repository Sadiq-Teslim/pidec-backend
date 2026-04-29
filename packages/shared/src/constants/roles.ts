export const USER_ROLES = ['student', 'admin', 'judge'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const VERIFICATION_STATUSES = [
  'pending',
  'verified',
  'rejected',
  'flagged',
  'suspended',
] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const VERIFICATION_METHODS = ['groq', 'gemini', 'manual'] as const;
export type VerificationMethod = (typeof VERIFICATION_METHODS)[number];

export const TEAM_STATUSES = ['active', 'disqualified', 'under_review'] as const;
export type TeamStatus = (typeof TEAM_STATUSES)[number];

export const INVITE_STATUSES = [
  'pending',
  'accepted',
  'declined',
  'expired',
  'cancelled',
] as const;
export type InviteStatus = (typeof INVITE_STATUSES)[number];

export const SUBMISSION_STATUSES = [
  'submitted',
  'under_review',
  'feedback_published',
] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const JUDGE_STAGE_SCOPES = ['stage_1', 'stage_2'] as const;
export type JudgeStageScope = (typeof JUDGE_STAGE_SCOPES)[number];

export const FEEDBACK_OUTCOMES = ['advanced', 'not_advanced', 'pending'] as const;
export type FeedbackOutcome = (typeof FEEDBACK_OUTCOMES)[number];
