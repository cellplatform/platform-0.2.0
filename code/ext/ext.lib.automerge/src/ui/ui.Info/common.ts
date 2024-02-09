import { type t } from '../common';
export { Doc } from '../../Doc';
export * from '../common';

/**
 * Constants
 */

export const DEFAULTS = {
  fields: {
    get all(): t.InfoField[] {
      return ['Module', 'Module.Verify', 'Component', 'Repo', 'Doc', 'Doc.URI', 'Doc.Object'];
    },
    get default(): t.InfoField[] {
      return ['Module', 'Module.Verify'];
    },
  },
  query: { dev: 'dev' },
} as const;
