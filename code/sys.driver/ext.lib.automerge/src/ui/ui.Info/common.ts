import { Doc } from '../../crdt';
import { Pkg, type t } from '../common';
import { DocUri } from '../ui.DocUri';

export { useDocs } from '../../ui/ui.use';
export { MonospaceButton } from '../ui.Buttons';
export { HistoryGrid, MonoHash } from '../ui.Info.History.Grid';
export { NavPaging } from '../ui.Nav.Paging';

export * from '../common';
export { Doc, DocUri };

type P = t.InfoProps;

/**
 * Constants
 */
const name = 'Info';
const displayName = `${Pkg.name}:${name}`;
const props: t.PickRequired<P, 'theme' | 'enabled' | 'fields'> = {
  theme: 'Dark',
  enabled: true,
  get fields() {
    return fields.default;
  },
};

type F = t.InfoVisible<t.InfoField>['filter'];
const visibleFilter: F = (e) => (e.visible ? e.fields : ['Visible']);
const fields = {
  visibleFilter,
  get all(): t.InfoField[] {
    return [
      'Visible',
      'Module',
      'Module.Verify',
      'Component',
      'Repo',
      'Doc',
      'Doc.Repo',
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

const docUri = DocUri.DEFAULTS.props;

export const DEFAULTS = {
  name,
  displayName,
  query: { dev: 'dev' },
  props,
  fields,
  repo: { label: 'Store' },
  doc: {
    head: { label: 'Head', hashLength: 6 },
    uri: {
      shorten: docUri.shorten,
      prefix: docUri.prefix,
      head: docUri.head,
      clipboard: docUri.clipboard,
    },
  },
  history: {
    label: 'History',
    list: { page: 0, limit: 5, sort: 'desc' },
    item: { hashLength: 6 },
  },

  Stateful: { name: `${name}.Stateful`, displayName: `${displayName}.Stateful` },
} as const;
