import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { toast } from "sonner";

const SUPABASE_URL = "https://byjyyshxviieqkymavnh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5anl5c2h4dmlpZXFreW1hdm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMjQ1ODMsImV4cCI6MjA1MTYwMDU4M30.iP1Tlz7tnwO9GDY4oW12fN8IwImcjkoLpBhdsCq1VwM";

const maxRetries = 3;
const retryDelay = 1000; // 1 second

const fetchWithRetry = async (url: string, options: any, retries = maxRetries): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying fetch... (${maxRetries - retries + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      fetch: fetchWithRetry as any,
      headers: {
        'X-Client-Info': 'supabase-js-web',
      },
    },
    db: {
      schema: 'public'
    }
  }
);

// Add error event listener
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('Failed to fetch')) {
    console.error('Supabase connection error:', event.reason);
    toast.error('Connection error. Please check your internet connection and try again.');
  }
});