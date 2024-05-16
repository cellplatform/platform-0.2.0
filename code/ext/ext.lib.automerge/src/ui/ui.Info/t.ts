import type { t } from './common';

export type InfoField =
  | 'Visible'
  | 'Module'
  | 'Module.Verify'
  | 'Component'
  | 'Repo'
  | 'Doc'
  | 'Doc.URI'
  | 'Doc.Object'
  | 'Doc.Head'
  | 'Doc.History'
  | 'Doc.History.Genesis'
  | 'Doc.History.List'
  | 'Doc.History.List.Detail'
  | 'Doc.History.List.NavPaging';

export type InfoData = {
  visible?: t.InfoDataVisible<InfoField>;
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
  repo?: InfoDataRepo;
  document?: InfoDataDoc | InfoDataDoc[];
};

export type InfoDataRepo = {
  label?: string;
  name?: string;
  store?: t.Store;
  index?: t.StoreIndexState;
};

export type InfoDataDoc = {
  label?: string;
  ref?: t.DocRef | t.UriString;
  uri?: InfoDataDocUri;
  object?: InfoDataDocObject;
  head?: { label?: string; hashLength?: number };
  icon?: { onClick?(e: { uri: t.UriString }): void };
  history?: InfoDataDocHistory;
};

export type InfoDataDocObject = {
  visible?: boolean;
  lens?: t.ObjectPath;
  name?: string;
  expand?: { level?: number; paths?: string[] };
  dotMeta?: boolean; // Default true. Deletes a [.meta] field if present.
  beforeRender?: (mutate: unknown) => void;
};

export type InfoDataDocUri = {
  shorten?: number | [number, number];
  prefix?: string | null;
  clipboard?: (uri: t.UriString) => string;
};

export type InfoDataDocHistory = {
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
  data?: t.InfoData;
  theme?: t.CommonTheme;
  margin?: t.CssEdgesInput;
  card?: boolean;
  flipped?: boolean;

  stateful?: boolean;
  resetState$?: t.Observable<any>;

  style?: t.CssValue;
  onStateChange?: InfoStatefulChangeHandler;
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

export type InfoStatefulChangeHandler = (e: InfoStatefulChangeHandlerArgs) => void;
export type InfoStatefulChangeHandlerArgs = {
  readonly action: InfoStatefulChangeAction;
  readonly fields: InfoField[];
  readonly data: InfoData;
};

export type InfoStatefulChangeAction = 'Toggle:Visible' | 'Toggle:ObjectVisible';
