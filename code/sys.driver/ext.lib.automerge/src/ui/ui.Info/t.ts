import type { t } from './common';

type O = Record<string, unknown>;

export type InfoField =
  | 'Visible'
  | 'Module'
  | 'Module.Verify'
  | 'Component'
  | 'Repo'
  | 'Doc'
  | 'Doc.Repo'
  | 'Doc.URI'
  | 'Doc.Object'
  | 'Doc.History'
  | 'Doc.History.Genesis'
  | 'Doc.History.List'
  | 'Doc.History.List.Detail'
  | 'Doc.History.List.NavPaging';

export type InfoFieldCtx = {
  repos?: t.InfoRepos;
  fields: t.InfoField[];
  theme: t.CommonTheme;
  enabled: boolean;
  debug?: string;
};

/**
 * Data (Root)
 */
export type InfoData = {
  visible?: t.InfoDataVisible<InfoField>;
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
  document?: InfoDoc | InfoDoc[];
  repo?: t.InfoRepoName; // default repo if not specified on {document}.
};

/**
 * Repo
 */
export type InfoRepo = {
  name?: t.InfoRepoName;
  label?: string;
  store?: t.Store;
  index?: t.StoreIndex;
};

export type InfoRepoName = string;
export type InfoRepos = { [key: InfoRepoName]: t.InfoRepo };

/**
 * Document
 */
export type InfoDoc<R extends t.InfoRepoName = string> = {
  label?: string;
  ref?: t.Doc | t.UriString;
  repo?: R;
  uri?: InfoDocUri;
  object?: InfoDocObject;
  head?: { label?: string; hashLength?: number };
  history?: InfoDocHistory;
};

export type InfoDocObject = {
  visible?: boolean;
  lens?: t.ObjectPath;
  name?: string;
  expand?: { level?: number; paths?: string[] };
  dotMeta?: boolean; // Default true. Deletes a [.meta] field if present.
  beforeRender?: (mutate: O) => void | O;
  onToggleClick?(e: { uri: t.UriString; modifiers: t.KeyboardModifierFlags }): void;
};

export type InfoDocUri = {
  shorten?: number | [number, number];
  prefix?: string | null;
  head?: boolean | number;
  clipboard?: boolean;
};

export type InfoDocHistory = {
  label?: string;
  list?: {
    page?: t.Index;
    limit?: t.Index;
    sort?: t.SortOrder;
    showDetailFor?: t.HashString | t.HashString[];
  };
  item?: {
    hashLength?: number;
    onClick?: InfoDataHistoryItemHandler;
  };
};

/**
 * <Component>
 */
export type InfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: (t.InfoField | undefined)[];
  theme?: t.CommonTheme;
  margin?: t.CssEdgesInput;
  debug?: string;

  data?: t.InfoData;
  repos?: t.InfoRepos;

  stateful?: boolean; // TODO TEMP 🐷 TODO REMOVE
  resetState$?: t.Observable<any>;

  enabled?: boolean;
  style?: t.CssValue;
  onStateChange?: t.InfoStatefulChangeHandler;
};

/**
 * Events
 */
export type InfoDataHistoryItemHandler = (e: InfoDataHistoryItemHandlerArgs) => void;
export type InfoDataHistoryItemHandlerArgs = {
  readonly index: t.Index;
  readonly hash: t.HashString;
  readonly commit: t.DocHistoryCommit;
  readonly is: { first: boolean; last: boolean };
};

export type InfoStatefulChangeAction = 'Toggle:Visible' | 'Toggle:ObjectVisible';
export type InfoStatefulChangeHandler = (e: InfoStatefulChangeHandlerArgs) => void;
export type InfoStatefulChangeHandlerArgs = {
  readonly action: InfoStatefulChangeAction;
  readonly fields: InfoField[];
  readonly data: InfoData;
};
