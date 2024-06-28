import { Doc } from '../../crdt';
import { Pkg, type t } from '../common';

export * from '../common';
export { MonospaceButton } from '../ui.Buttons';
export { MonoHash } from '../ui.History.Grid';
export { Doc };

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
      'Doc.History',
      'Doc.History.Genesis',
      'Doc.History.List',
      'Doc.History.List.Detail',
      'Doc.History.List.NavPaging',
    ];
  },
  get default(): t.InfoField[] {
    return ['Module', 'Module.Verify', 'Repo'];
  },
};

const visibleFilter: t.InfoDataVisible<t.InfoField>['filter'] = (e) => {
  return e.visible ? e.fields : ['Visible'];
};

const uri: Required<t.InfoDataDocUri> = {
  shorten: [4, 4],
  prefix: 'crdt',
  head: 2,
  clipboard: (uri) => Doc.Uri.id(uri),
};

export const DEFAULTS = {
  displayName: `${Pkg.name}.Info`,
  stateful: false,
  visibleFilter,
  fields,
  theme: 'Light',
  repo: { label: 'Store' },
  doc: { head: { label: 'Head', hashLength: 6 }, uri },
  history: {
    label: 'History',
    list: { page: 0, limit: 5, sort: 'desc' },
    item: { hashLength: 6 },
  },
  query: { dev: 'dev' },
} as const;
