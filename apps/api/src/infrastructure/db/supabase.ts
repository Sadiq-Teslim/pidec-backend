import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@pidec/db-types';
import { env } from '../../shared/config/env.js';

let serviceClient: SupabaseClient<Database> | null = null;

/**
 * Service-role Supabase client for backend use. Bypasses RLS — every
 * caller is responsible for enforcing authorisation in the use case layer
 * before issuing queries with this client.
 *
 * NEVER expose this client (or its key) to the frontend.
 */
export const getSupabaseService = (): SupabaseClient<Database> => {
  if (serviceClient) return serviceClient;
  serviceClient = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: { 'x-pidec-server': 'api' },
      },
    },
  );
  return serviceClient;
};
