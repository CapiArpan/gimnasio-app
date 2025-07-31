// src/lib/api/auth.js
import { supabase } from '../supabaseClient';

export async function getUserSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function logout() {
  await supabase.auth.signOut();
}
