import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const fields = {
  get all(): t.InfoField[] {
    return ['Module', 'Module.Verify'];
  },
  get default(): t.InfoField[] {
    return ['Module', 'Module.Verify'];
  },
};

export const DEFAULTS = {
  displayName: `${Pkg.name}:Info`,
  fields,
  query: { dev: 'dev' },
} as const;
