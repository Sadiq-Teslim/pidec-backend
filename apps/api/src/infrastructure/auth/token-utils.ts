import crypto from 'crypto';

/**
 * Generate a secure random token (for email verification / password reset).
 * Returns both the raw token (to send in email) and the hash (to store in DB).
 */
export const generateSecureToken = (lengthBytes = 32): { token: string; hash: string } => {
  const token = crypto.randomBytes(lengthBytes).toString('hex');
  // Hash with SHA-256 for storage (never store raw tokens)
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
};

/**
 * Hash a token for comparison with stored hash.
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Check if a token is expired.
 */
export const isTokenExpired = (expiresAt: Date | string): boolean => {
  const expiry = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  return expiry < new Date();
};

/**
 * Get token expiry time (minutes from now).
 */
export const getTokenExpiryMinutes = (minutes: number): Date => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + minutes);
  return expiry;
};
