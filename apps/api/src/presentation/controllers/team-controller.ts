import { type RequestHandler } from 'express';
import { getSupabaseService } from '../../infrastructure/db/supabase.js';
import { AppError } from '../../shared/errors/app-error.js';
import { logger } from '../../shared/logger/index.js';

const getActiveEditionId = async (): Promise<string> => {
  const supabase = getSupabaseService() as any;
  const { data, error } = await supabase
    .from('editions')
    .select('id,team_management_locked')
    .eq('is_active', true)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw AppError.notFound('No active edition configured');
  return data.id;
};

const getUserProfile = async (userId: string) => {
  const supabase = getSupabaseService() as any;
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw AppError.notFound('User profile not found');
  return data;
};

export const createTeam: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw AppError.unauthenticated();

    const { name } = req.body as { name: string };
    const supabase = getSupabaseService() as any;
    const user = await getUserProfile(req.user.id);

    if (user.is_suspended) throw AppError.forbidden('Suspended users cannot create teams');
    if (user.verification_status !== 'verified') {
      throw AppError.forbidden('Only verified users can create teams');
    }
    if (user.team_id) throw AppError.validation('You are already in a team');

    const { data: edition, error: editionError } = await supabase
      .from('editions')
      .select('id,team_management_locked')
      .eq('is_active', true)
      .is('deleted_at', null)
      .maybeSingle();

    if (editionError) throw editionError;
    if (!edition) throw AppError.notFound('No active edition configured');
    if (edition.team_management_locked) {
      throw AppError.forbidden('Team management is locked for the active stage');
    }

    const { data: team, error } = await supabase
      .from('teams')
      .insert([
        {
          edition_id: edition.id,
          name,
          department: user.department,
          leader_id: user.id,
        },
      ] as never[])
      .select('*')
      .single();

    if (error) throw error;

    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ team_id: team.id } as never)
      .eq('id', user.id);

    if (userUpdateError) throw userUpdateError;

    logger.info({ userId: user.id, teamId: team.id }, 'Team created');

    res.status(201).json({
      status: 'success',
      data: { team },
    });
  } catch (err) {
    next(err);
  }
};

export const getMyTeam: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw AppError.unauthenticated();

    const supabase = getSupabaseService() as any;
    const user = await getUserProfile(req.user.id);

    if (!user.team_id) {
      return res.status(200).json({
        status: 'success',
        data: { team: null, members: [] },
      });
    }

    const [{ data: team, error: teamError }, { data: members, error: membersError }] =
      await Promise.all([
        supabase
          .from('teams')
          .select('*')
          .eq('id', user.team_id)
          .is('deleted_at', null)
          .maybeSingle(),
        supabase
          .from('users')
          .select('id,name,email,role,verification_status')
          .eq('team_id', user.team_id)
          .is('deleted_at', null),
      ]);

    if (teamError) throw teamError;
    if (membersError) throw membersError;

    return res.status(200).json({
      status: 'success',
      data: {
        team,
        members: members ?? [],
      },
    });
  } catch (err) {
    next(err);
  }
};

export const searchTeammates: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw AppError.unauthenticated();
    const { query } = req.query as { query: string };

    const supabase = getSupabaseService() as any;
    const user = await getUserProfile(req.user.id);

    const { data, error } = await supabase
      .from('users')
      .select('id,name,email,department,verification_status')
      .ilike('name', `%${query}%`)
      .eq('department', user.department)
      .is('team_id', null)
      .eq('verification_status', 'verified')
      .is('deleted_at', null)
      .neq('id', user.id)
      .limit(20);

    if (error) throw error;

    res.status(200).json({
      status: 'success',
      data: { results: data ?? [] },
    });
  } catch (err) {
    next(err);
  }
};

export const listMyInvites: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw AppError.unauthenticated();

    const supabase = getSupabaseService() as any;

    const { error: expireError } = await supabase
      .from('team_invites')
      .update({ status: 'expired', responded_at: new Date().toISOString() } as never)
      .eq('invitee_id', req.user.id)
      .eq('status', 'pending')
      .lt('expires_at', new Date().toISOString());

    if (expireError) throw expireError;

    const { data, error } = await supabase
      .from('team_invites')
      .select('*, teams(id,name,department), users!team_invites_invited_by_fkey(id,name,email)')
      .eq('invitee_id', req.user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      status: 'success',
      data: { invites: data ?? [] },
    });
  } catch (err) {
    next(err);
  }
};

export const sendInvite: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw AppError.unauthenticated();

    const { inviteeId } = req.body as { inviteeId: string };
    const supabase = getSupabaseService() as any;
    const sender = await getUserProfile(req.user.id);

    if (!sender.team_id) throw AppError.validation('You must belong to a team to invite members');

    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', sender.team_id)
      .is('deleted_at', null)
      .maybeSingle();

    if (teamError) throw teamError;
    if (!team) throw AppError.notFound('Team not found');
    if (team.leader_id !== sender.id) throw AppError.forbidden('Only team leader can send invites');

    const { data: edition, error: editionError } = await supabase
      .from('editions')
      .select('team_management_locked')
      .eq('is_active', true)
      .is('deleted_at', null)
      .maybeSingle();

    if (editionError) throw editionError;
    if (!edition) throw AppError.notFound('No active edition configured');
    if (edition.team_management_locked) throw AppError.forbidden('Team management is locked');

    const { data: invitee, error: inviteeError } = await supabase
      .from('users')
      .select('*')
      .eq('id', inviteeId)
      .is('deleted_at', null)
      .maybeSingle();

    if (inviteeError) throw inviteeError;
    if (!invitee) throw AppError.notFound('Invitee not found');
    if (invitee.team_id) throw AppError.validation('Invitee already belongs to a team');
    if (invitee.department !== team.department) {
      throw AppError.validation('Invitee must be from the same department');
    }

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    const { data: created, error } = await supabase
      .from('team_invites')
      .insert([
        {
          team_id: team.id,
          invitee_id: inviteeId,
          invited_by: sender.id,
          status: 'pending',
          expires_at: expiresAt,
        },
      ] as never[])
      .select('*')
      .single();

    if (error) throw error;

    await supabase.from('notifications').insert([
      {
        user_id: inviteeId,
        type: 'invite_received',
        title: 'Team invite received',
        message: `${sender.name} invited you to join ${team.name}`,
        action_url: '/dashboard/team',
      },
    ] as never[]);

    res.status(201).json({
      status: 'success',
      data: { invite: created },
    });
  } catch (err) {
    next(err);
  }
};

export const respondInvite: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw AppError.unauthenticated();

    const { inviteId, status } = req.body as { inviteId: string; status: 'accepted' | 'declined' };
    const supabase = getSupabaseService() as any;

    const { data: invite, error: inviteError } = await supabase
      .from('team_invites')
      .select('*')
      .eq('id', inviteId)
      .eq('invitee_id', req.user.id)
      .is('deleted_at', null)
      .maybeSingle();

    if (inviteError) throw inviteError;
    if (!invite) throw AppError.notFound('Invite not found');
    if (invite.status !== 'pending') throw AppError.validation('Invite is no longer pending');

    if (new Date(invite.expires_at).getTime() < Date.now()) {
      await supabase
        .from('team_invites')
        .update({ status: 'expired', responded_at: new Date().toISOString() } as never)
        .eq('id', invite.id);
      throw AppError.validation('Invite has expired');
    }

    const now = new Date().toISOString();

    const { error: updateInviteError } = await supabase
      .from('team_invites')
      .update({ status, responded_at: now } as never)
      .eq('id', invite.id);

    if (updateInviteError) throw updateInviteError;

    if (status === 'accepted') {
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ team_id: invite.team_id } as never)
        .eq('id', req.user.id)
        .is('deleted_at', null)
        .is('team_id', null);

      if (userUpdateError) throw userUpdateError;
    }

    res.status(200).json({
      status: 'success',
      data: { inviteId: invite.id, status },
    });
  } catch (err) {
    next(err);
  }
};

export const removeMember: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw AppError.unauthenticated();

    const { userId } = req.body as { userId: string };
    if (userId === req.user.id) throw AppError.validation('Leader cannot remove self');

    const supabase = getSupabaseService() as any;
    const leader = await getUserProfile(req.user.id);
    if (!leader.team_id) throw AppError.validation('You are not in a team');

    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', leader.team_id)
      .is('deleted_at', null)
      .maybeSingle();

    if (teamError) throw teamError;
    if (!team) throw AppError.notFound('Team not found');
    if (team.leader_id !== req.user.id) throw AppError.forbidden('Only leader can remove members');

    const { data: edition, error: editionError } = await supabase
      .from('editions')
      .select('team_management_locked')
      .eq('is_active', true)
      .is('deleted_at', null)
      .maybeSingle();

    if (editionError) throw editionError;
    if (!edition) throw AppError.notFound('No active edition configured');
    if (edition.team_management_locked) throw AppError.forbidden('Team management is locked');

    const { error: removeError } = await supabase
      .from('users')
      .update({ team_id: null } as never)
      .eq('id', userId)
      .eq('team_id', team.id);

    if (removeError) throw removeError;

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const dissolveTeam: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw AppError.unauthenticated();

    const { teamId } = req.params as { teamId: string };
    const supabase = getSupabaseService() as any;

    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .is('deleted_at', null)
      .maybeSingle();

    if (teamError) throw teamError;
    if (!team) throw AppError.notFound('Team not found');
    if (team.leader_id !== req.user.id) throw AppError.forbidden('Only leader can dissolve team');

    const { data: edition, error: editionError } = await supabase
      .from('editions')
      .select('team_management_locked')
      .eq('is_active', true)
      .is('deleted_at', null)
      .maybeSingle();

    if (editionError) throw editionError;
    if (!edition) throw AppError.notFound('No active edition configured');
    if (edition.team_management_locked) throw AppError.forbidden('Team management is locked');

    const now = new Date().toISOString();

    const [{ error: membersResetError }, { error: deleteError }] = await Promise.all([
      supabase
        .from('users')
        .update({ team_id: null } as never)
        .eq('team_id', team.id),
      supabase
        .from('teams')
        .update({ deleted_at: now } as never)
        .eq('id', team.id),
    ]);

    if (membersResetError) throw membersResetError;
    if (deleteError) throw deleteError;

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};
