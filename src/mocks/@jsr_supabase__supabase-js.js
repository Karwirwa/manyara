// Mock for @jsr/supabase__supabase-js
export const createClient = () => ({
  from: () => ({
    select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
    insert: () => ({ select: () => Promise.resolve({ data: null, error: null }) }),
  }),
  functions: {
    invoke: () => Promise.resolve({ data: null, error: null }),
  },
});