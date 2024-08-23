export * from '../common';

export const DEFAULTS = {
  origins: { local: 'http://localhost:8080', remote: 'https://api.db.team' },
  deploy: { retries: 5, delay: 3000 },
} as const;
