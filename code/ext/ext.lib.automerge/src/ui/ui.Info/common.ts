import { type t } from '../common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  history: {
    label: 'History',
    list: { page: 1, limit: 10, sort: 'desc' },
  },
  repo: {
    label: 'Store',
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
        'History.Genesis',
        'History.List',
        'History.List.Detail',
        'History.List.NavPaging',
      ];
    },
    get default(): t.InfoField[] {
      return ['Module', 'Module.Verify'];
    },
  },
  query: { dev: 'dev' },
} as const;
