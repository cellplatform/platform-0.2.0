import { type t } from '../common';
export * from '../common';
export { MonoHash } from '../ui.History.Grid';

/**
 * Constants
 */

const fields = {
  get all(): t.InfoField[] {
    return [
      'Visible',
      'Module',
      'Module.Verify',
      'Component',
      'Repo',
      'Doc',
      'Doc.URI',
      'Doc.Object',
      'Doc.Head',
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
} as const;

export const DEFAULTS = {
  repo: { label: 'Store' },
  history: {
    label: 'History',
    list: { page: 0, limit: 5, sort: 'desc' },
    item: { hashLength: 6 },
  },
  doc: {
    head: { label: 'Head', hashLength: 6 },
  },
  fields,
  query: { dev: 'dev' },
} as const;
