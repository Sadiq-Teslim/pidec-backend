import jwt from 'jsonwebtoken';
import { env } from '../../shared/config/env.js';

const JWT_SECRET = env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key as JWT secret

export interface JwtPayload {
  sub: string; // user ID
  email: string;
  role: 'student' | 'admin' | 'judge';
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes (in seconds)
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days (in seconds)

/**
 * Generate a signed JWT access token.
 */
export const generateAccessToken = (payload: Omit<JwtPayload, 'type' | 'iat' | 'exp'>): string => {
  return jwt.sign(
    { ...payload, type: 'access' },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }, // in seconds
  );
};

/**
 * Generate a signed JWT refresh token.
 */
export const generateRefreshToken = (payload: Omit<JwtPayload, 'type' | 'iat' | 'exp'>): string => {
  return jwt.sign(
    { ...payload, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }, // in seconds
  );
};

/**
 * Verify and decode a JWT token (either access or refresh).
 * Throws if token is invalid or expired.
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid token';
    throw new Error(`Token verification failed: ${message}`);
  }
};

/**
 * Get the token expiry time in seconds (relative to now).
 */
export const getTokenExpirySeconds = (token: string): number => {
  const decoded = jwt.decode(token) as JwtPayload | null;
  if (!decoded || !decoded.exp) return -1;
  return decoded.exp - Math.floor(Date.now() / 1000);
};
