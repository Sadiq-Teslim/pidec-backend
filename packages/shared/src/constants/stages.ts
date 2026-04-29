export const STAGES = [1, 2, 3] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_NAMES: Record<Stage, string> = {
  1: 'Stage 1 — Concept Proposal',
  2: 'Stage 2 — Prototype & Demo',
  3: 'Stage 3 — Grand Finale',
};

/**
 * Stage 1 word limits per section. Server-side enforced.
 * Order corresponds to PRD §6.2.
 */
export const STAGE_1_WORD_LIMITS = {
  problem_statement: 300,
  proposed_solution: 500,
  theme_alignment: 250,
  feasibility: 400,
  departmental_relevance: 150,
} as const;

export type Stage1SectionKey = keyof typeof STAGE_1_WORD_LIMITS;

export const STAGE_1_SECTION_KEYS: readonly Stage1SectionKey[] = Object.keys(
  STAGE_1_WORD_LIMITS,
) as Stage1SectionKey[];

export const STAGE_1_SECTION_LABELS: Record<Stage1SectionKey, string> = {
  problem_statement: 'Problem Statement',
  proposed_solution: 'Proposed Engineering Solution',
  theme_alignment: 'Theme Alignment',
  feasibility: 'Preliminary Feasibility Assessment',
  departmental_relevance: 'Departmental Relevance Declaration',
};

export const STAGE_1_DECLARATION_KEYS = [
  'original_work',
  'no_external_authoring',
  'agree_to_rules',
  'consent_to_publication',
] as const;

export type Stage1DeclarationKey = (typeof STAGE_1_DECLARATION_KEYS)[number];

export const STAGE_1_DECLARATION_LABELS: Record<Stage1DeclarationKey, string> = {
  original_work:
    'We confirm this submission is the original work of our team and reflects our own ideas.',
  no_external_authoring:
    'No external party (mentor, lecturer, or third-party service) authored any portion of the proposal text.',
  agree_to_rules:
    'We have read and agree to the official PIDEC 1.0 competition rules.',
  consent_to_publication:
    'We consent to PIDEC publishing our team name and submission summary if selected to advance.',
};
