import { getSupabaseService } from '../../infrastructure/db/supabase.js';

export interface VerificationToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export interface PasswordResetToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

/**
 * Token repository — manages verification and password reset tokens.
 */
export class TokenRepository {
  /**
   * Create a new email verification token.
   */
  async createVerificationToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<VerificationToken> {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('email_verification_tokens')
      .insert([{ user_id: userId, token, expires_at: expiresAt.toISOString() }] as never[])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Find a verification token by token string.
   */
  async findVerificationToken(token: string): Promise<VerificationToken | null> {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('email_verification_tokens')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (error) throw error;
    return data ?? null;
  }

  /**
   * Mark a verification token as used.
   */
  async markVerificationTokenUsed(tokenId: string): Promise<void> {
    const supabase = getSupabaseService();
    const { error } = await supabase
      .from('email_verification_tokens')
      .update({ used_at: new Date().toISOString() } as never)
      .eq('id', tokenId);

    if (error) throw error;
  }

  /**
   * Create a new password reset token.
   */
  async createPasswordResetToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<PasswordResetToken> {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('password_reset_tokens')
      .insert([{ user_id: userId, token, expires_at: expiresAt.toISOString() }] as never[])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Find a password reset token by token string.
   */
  async findPasswordResetToken(token: string): Promise<PasswordResetToken | null> {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (error) throw error;
    return data ?? null;
  }

  /**
   * Mark a password reset token as used.
   */
  async markPasswordResetTokenUsed(tokenId: string): Promise<void> {
    const supabase = getSupabaseService();
    const { error } = await supabase
      .from('password_reset_tokens')
      .update({ used_at: new Date().toISOString() } as never)
      .eq('id', tokenId);

    if (error) throw error;
  }

  /**
   * Delete expired tokens (cleanup).
   */
  async deleteExpiredTokens(): Promise<number> {
    const supabase = getSupabaseService();
    const now = new Date().toISOString();

    // Delete expired verification tokens
    const { count: verCount, error: verError } = await supabase
      .from('email_verification_tokens')
      .delete()
      .lt('expires_at', now)
      .not('used_at', 'is', null);

    if (verError) throw verError;

    // Delete expired password reset tokens
    const { count: resetCount, error: resetError } = await supabase
      .from('password_reset_tokens')
      .delete()
      .lt('expires_at', now)
      .not('used_at', 'is', null);

    if (resetError) throw resetError;

    return (verCount ?? 0) + (resetCount ?? 0);
  }
}
