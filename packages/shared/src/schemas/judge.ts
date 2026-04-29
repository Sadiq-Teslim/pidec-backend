import { z } from 'zod';
import { UuidSchema } from './common.js';

/**
 * Stage 1 judge action: select the representative team for a department.
 * Per PRD §7b.2 the rubric is a guideline only — judges do not enter
 * structured scores at Stage 1. Optional comments are supported.
 */
export const Stage1RepresentativeSelectionSchema = z.object({
  submissionId: UuidSchema,
  comments: z.string().trim().max(5000).optional(),
});

export type Stage1RepresentativeSelectionInput = z.infer<
  typeof Stage1RepresentativeSelectionSchema
>;

/**
 * Stage 2 judge scoring. Criteria keys are flexible (rubric-driven) — the
 * application layer enforces "all rubric criteria must be present" by
 * comparing `Object.keys(scores)` against the active rubric.
 */
export const Stage2ScoreSchema = z.object({
  scores: z
    .record(z.string().min(1).max(60), z.number().min(0).max(100))
    .refine((rec) => Object.keys(rec).length >= 1, 'Score at least one criterion'),
  comments: z.record(z.string().min(1).max(60), z.string().trim().max(2000)),
});

export type Stage2ScoreInput = z.infer<typeof Stage2ScoreSchema>;
