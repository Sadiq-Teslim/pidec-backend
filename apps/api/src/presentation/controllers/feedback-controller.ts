import { type RequestHandler } from 'express';
import { getSupabaseService } from '../../infrastructure/db/supabase.js';
import { AppError } from '../../shared/errors/app-error.js';

const mapFeedbackRow = (row: any) => ({
  id: row.id,
  submissionId: row.submission_id,
  scores: row.scores ?? {},
  comments: row.comments ?? {},
  totalScore: row.total_score ?? null,
  outcome: row.outcome ?? null,
  published: Boolean(row.published),
  publishedAt: row.published_at ?? null,
  publishedBy: row.published_by ?? null,
  enteredByAdmin: row.entered_by_admin,
  evaluatorName: row.evaluator_name ?? null,
  evaluationDate: row.evaluation_date ?? null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  deletedAt: row.deleted_at ?? null,
});

const getCurrentUser = async (userId: string) => {
  const supabase = getSupabaseService() as any;
  const { data, error } = await supabase
    .from('users')
    .select('id,team_id,role,deleted_at')
    .eq('id', userId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw AppError.notFound('User profile not found');
  return data;
};

export const listMyFeedback: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw AppError.unauthenticated();

    const user = await getCurrentUser(req.user.id);
    if (!user.team_id) {
      return res.status(200).json({ status: 'success', data: { feedback: [] } });
    }

    const supabase = getSupabaseService() as any;
    const { data: submissions, error: submissionError } = await supabase
      .from('submissions')
      .select('id')
      .eq('team_id', user.team_id)
      .is('deleted_at', null);

    if (submissionError) throw submissionError;

    const submissionIds = (submissions ?? []).map((submission: { id: string }) => submission.id);
    if (submissionIds.length === 0) {
      return res.status(200).json({ status: 'success', data: { feedback: [] } });
    }

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .in('submission_id', submissionIds)
      .eq('published', true)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      status: 'success',
      data: { feedback: (data ?? []).map(mapFeedbackRow) },
    });
  } catch (err) {
    next(err);
  }
};

export const getSubmissionFeedback: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw AppError.unauthenticated();

    const params = req.params as { submissionId?: string; id?: string };
    const submissionId = params.submissionId ?? params.id;
    if (!submissionId) throw AppError.validation('Submission id is required');
    const user = await getCurrentUser(req.user.id);
    if (!user.team_id) {
      return res.status(200).json({ status: 'success', data: { feedback: null } });
    }

    const supabase = getSupabaseService() as any;
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .select('id,team_id')
      .eq('id', submissionId)
      .eq('team_id', user.team_id)
      .is('deleted_at', null)
      .maybeSingle();

    if (submissionError) throw submissionError;
    if (!submission) {
      throw AppError.notFound('Submission not found');
    }

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('submission_id', submission.id)
      .eq('published', true)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) throw error;

    res.status(200).json({
      status: 'success',
      data: { feedback: data ? mapFeedbackRow(data) : null },
    });
  } catch (err) {
    next(err);
  }
};
