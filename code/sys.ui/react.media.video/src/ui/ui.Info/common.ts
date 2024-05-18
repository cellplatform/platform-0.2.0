import { type t } from '../common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  query: { dev: 'dev' },
  fields: {
    get all(): t.InfoField[] {
      return ['Module', 'Module.Verify'];
    },
    get default(): t.InfoField[] {
      return ['Module', 'Module.Verify'];
    },
  },
} as const;
