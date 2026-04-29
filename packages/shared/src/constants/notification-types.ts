export const NOTIFICATION_TYPES = [
  'verification_approved',
  'verification_rejected',
  'verification_flagged',
  'invite_received',
  'invite_accepted',
  'invite_declined',
  'invite_expired',
  'team_locked',
  'team_dissolved',
  'member_removed',
  'submission_confirmed',
  'stage_advanced',
  'feedback_published',
  'team_disqualified',
  'leader_promoted',
  'announcement',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
