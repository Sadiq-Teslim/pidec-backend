/**
 * Domain entities re-export. Entities are pure data shapes — no framework
 * deps, no DB deps. They mirror the application-level types defined in
 * @pidec/shared but stay re-exported here so domain modules don't import
 * from `shared/types/domain` everywhere (clean architecture: domain owns
 * its types, even when they happen to match shared).
 */
export type {
  AppNotification,
  Edition,
  Feedback,
  Judge,
  JudgeScore,
  Submission,
  SubmissionFile,
  Team,
  TeamInvite,
  Token,
  User,
  StudentLevel,
} from '@pidec/shared';
