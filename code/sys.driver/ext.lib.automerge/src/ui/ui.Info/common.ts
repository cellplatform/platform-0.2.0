import { Doc } from '../../crdt';
import { Pkg, type t } from '../common';
import { DocUri } from '../ui.DocUri';

export * from '../common';
export { MonospaceButton } from '../ui.Buttons';
export { MonoHash } from '../ui.History.Grid';
export { Doc, DocUri };

type P = t.InfoProps;

/**
 * Constants
 */
const name = 'Info';
const props: t.PickRequired<P, 'theme' | 'enabled' | 'stateful' | 'fields'> = {
  theme: 'Light',
  enabled: true,
  stateful: false,
  get fields() {
    return fields.default;
  },
};

const fields = {
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

const visibleFilter: t.InfoDataVisible<t.InfoField>['filter'] = (e) => {
  return e.visible ? e.fields : ['Visible'];
};

const docUri = DocUri.DEFAULTS.props;

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  query: { dev: 'dev' },
  props,

  visibleFilter,
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
} as const;
