import { type t } from '../common';

export { Doc } from '../../Doc';
export * from '../common';

/**
 * Constants
 */

export const DEFAULTS = {
  history: {
    label: 'History',
    list: { page: 1, limit: 10, sort: 'desc' },
  },
  fields: {
    get all(): t.InfoField[] {
      return [
        'Module',
        'Module.Verify',
        'Component',
        'Repo',
        'Doc',
        'Doc.URI',
        'Doc.Object',
        'History',
        'History.List',
      ];
    },
    get default(): t.InfoField[] {
      return ['Module', 'Module.Verify'];
    },
  },
  query: { dev: 'dev' },
} as const;
