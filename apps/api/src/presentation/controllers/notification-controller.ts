import { type RequestHandler } from 'express';
import { getSupabaseService } from '../../infrastructure/db/supabase.js';
import { AppError } from '../../shared/errors/app-error.js';

export const listNotifications: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw AppError.unauthenticated();

    const { cursor, limit } = req.query as { cursor?: string; limit?: number };
    const pageSize = Number(limit ?? 20);

    const supabase = getSupabaseService() as any;
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(pageSize + 1);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;
    if (error) throw error;

    const rows = data ?? [];
    const hasMore = rows.length > pageSize;
    const items = hasMore ? rows.slice(0, pageSize) : rows;
    const nextCursor = hasMore ? (items[items.length - 1]?.created_at ?? null) : null;

    res.status(200).json({
      status: 'success',
      data: {
        items,
        hasMore,
        nextCursor,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const markNotificationRead: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw AppError.unauthenticated();

    const { id } = req.params as { id: string };
    const supabase = getSupabaseService() as any;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() } as never)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .is('deleted_at', null);

    if (error) throw error;

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const markAllNotificationsRead: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw AppError.unauthenticated();

    const supabase = getSupabaseService() as any;

    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() } as never)
      .eq('user_id', req.user.id)
      .eq('read', false)
      .is('deleted_at', null)
      .select('id');

    if (error) throw error;

    res.status(200).json({
      status: 'success',
      data: { updated: data?.length ?? 0 },
    });
  } catch (err) {
    next(err);
  }
};
