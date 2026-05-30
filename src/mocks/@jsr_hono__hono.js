// Mock for @jsr/hono__hono
export const Hono = () => ({
  get: () => {},
  post: () => {},
  fetch: () => new Response(),
});
export const Context = {};
export const Next = {};