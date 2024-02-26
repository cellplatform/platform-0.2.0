export * from '../common';

export const DEFAULTS = {
  origins: {
    local: `http://localhost:8080`,
    remote: `https://api.db.team`,
  },
} as const;

/**
 * Determine if the HTTP status code is OK (200).
 */
export function statusOK(input: number | Response) {
  const status = typeof input === 'number' ? input : input.status;
  return (status || 0).toString().startsWith('2');
}
