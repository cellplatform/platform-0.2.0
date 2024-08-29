import type { t } from './common';
export type * from './t.Stateful';

type O = Record<string, unknown>;
type P = t.PropListProps;

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
  repos: t.InfoRepos;
  fields: t.InfoField[];
  theme: t.CommonTheme;
  enabled: boolean;
  handlers: t.InfoHandlers;
  debug?: string;
};

/**
 * <Component>
 */
export type InfoProps = InfoHandlers & {
  title?: P['title'];
  width?: P['width'];
  fields?: (t.InfoField | undefined)[];
  theme?: t.CommonTheme;
  margin?: t.CssEdgesInput;
  debug?: string;
  enabled?: boolean;

  repos?: t.InfoRepos;
  data?: t.InfoData;

  enabled?: boolean;
  theme?: t.CommonTheme;
  margin?: t.CssEdgesInput;
  style?: t.CssValue;
};

export type InfoHandlers = {
  onDocToggleClick?: t.InfoDocToggleHandler;
  onBeforeObjectRender?: t.InfoBeforeObjectRenderHandler;
  onVisibleToggle?: t.InfoVisibleToggleHandler;
};

/**
 * Data (Root)
 */
export type InfoData = {
  visible?: t.InfoVisible<InfoField>;
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
 * Events
 */
export type InfoHistoryItemHandler = (e: InfoHistoryItemHandlerArgs) => void;
export type InfoHistoryItemHandlerArgs = {
  readonly index: t.Index;
  readonly hash: t.HashString;
  readonly commit: t.DocHistoryCommit;
  readonly is: { first: boolean; last: boolean };
};

export type InfoDocToggleHandler = (e: InfoDocToggleHandlerArgs) => void;
export type InfoDocToggleHandlerArgs = {
  readonly index: t.Index;
  readonly data: InfoDoc;
  readonly modifiers: t.KeyboardModifierFlags;
  readonly visible: { prev: boolean; next: boolean };
};

export type InfoBeforeObjectRenderHandler = (
  mutate: O,
  ctx: { index: t.Index; data: InfoDoc },
) => void | O;
