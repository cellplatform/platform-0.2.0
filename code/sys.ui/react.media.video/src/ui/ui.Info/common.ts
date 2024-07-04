import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:Info`,
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
