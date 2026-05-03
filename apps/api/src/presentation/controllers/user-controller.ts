import { type RequestHandler } from 'express';
import { getSupabaseService } from '../../infrastructure/db/supabase.js';
import { AppError } from '../../shared/errors/app-error.js';

const selectOwnProfile = async (userId: string) => {
  const supabase = getSupabaseService() as any;
  const { data, error } = await supabase
    .from('users')
    .select(
      'id,name,email,matric_number,department,level,verification_status,verification_method,verification_timestamp,is_suspended,team_id,role,created_at,updated_at',
    )
    .eq('id', userId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw AppError.notFound('User profile not found');
  return data;
};

export const getOwnProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw AppError.unauthenticated();

    const profile = await selectOwnProfile(req.user.id);
    res.status(200).json({ status: 'success', data: { user: profile } });
  } catch (err) {
    next(err);
  }
};

export const updateOwnProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw AppError.unauthenticated();

    const supabase = getSupabaseService() as any;
    const patch = req.body as { name?: string; level?: number };

    const { data, error } = await supabase
      .from('users')
      .update({
        ...(patch.name !== undefined ? { name: patch.name } : {}),
        ...(patch.level !== undefined ? { level: patch.level } : {}),
      } as never)
      .eq('id', req.user.id)
      .is('deleted_at', null)
      .select(
        'id,name,email,matric_number,department,level,verification_status,verification_method,verification_timestamp,is_suspended,team_id,role,created_at,updated_at',
      )
      .single();

    if (error) throw error;

    res.status(200).json({ status: 'success', data: { user: data } });
  } catch (err) {
    next(err);
  }
};
