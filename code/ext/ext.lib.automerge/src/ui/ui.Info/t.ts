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
  | 'History'
  | 'History.Genesis'
  | 'History.List'
  | 'History.List.Detail'
  | 'History.List.NavPaging';

export type InfoData = {
  visible?: t.InfoDataVisible<InfoField>;
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
  repo?: InfoDataRepo;
  document?: InfoDataDocument;
  history?: InfoDataHistory;
};

export type InfoDataRepo = {
  label?: string;
  name?: string;
  store?: t.Store;
  index?: t.StoreIndexState;
};

export type InfoDataDocument = {
  label?: string;
  doc?: t.DocRef | t.UriString;
  uri?: { shorten?: number | [number, number] };
  object?: { name?: string; expand?: { level?: number; paths?: string[] } };
  head?: { label?: string; hashLength?: number };
  icon?: { onClick?(e: {}): void };
};

export type InfoDataHistory = {
  label?: string;
  doc?: t.DocRef | t.UriString;
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
  index: t.Index;
  hash: t.HashString;
  commit: t.DocHistoryCommit;
  is: { first: boolean; last: boolean };
};

export type InfoStatefulChangeHandler = (e: InfoStatefulChangeHandlerArgs) => void;
export type InfoStatefulChangeHandlerArgs = {
  readonly fields: InfoField[];
  readonly data: InfoData;
};
