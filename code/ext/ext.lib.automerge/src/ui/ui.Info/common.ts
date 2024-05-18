import { Doc } from '../../crdt';
import { type t } from '../common';

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
      'Doc.Head',
      'Doc.History',
      'Doc.History.Genesis',
      'Doc.History.List',
      'Doc.History.List.Detail',
      'Doc.History.List.NavPaging',
    ];
  },
  get default(): t.InfoField[] {
    return ['Module', 'Module.Verify'];
  },
};

const visibleFilter: t.InfoDataVisible<t.InfoField>['filter'] = (e) => {
  return e.visible ? e.fields : ['Visible'];
};

const uri: Required<t.InfoDataDocUri> = {
  shorten: [4, 4],
  prefix: 'crdt:automerge',
  clipboard: (uri) => Doc.Uri.id(uri),
};

export const DEFAULTS = {
  displayName: 'Automerge.Info',
  stateful: false,
  visibleFilter,
  repo: { label: 'Store' },
  doc: { head: { label: 'Head', hashLength: 6 }, uri },
  history: {
    label: 'History',
    list: { page: 0, limit: 5, sort: 'desc' },
    item: { hashLength: 6 },
  },
  fields,
  query: { dev: 'dev' },
} as const;
