import type { t } from './common';

type O = Record<string, unknown>;

export type InfoField =
  | 'Visible'
  | 'Module'
  | 'Module.Verify'
  | 'Component'
  | 'Repo'
  | 'Doc'
  | 'Doc.URI'
  | 'Doc.Object'
  | 'Doc.History'
  | 'Doc.History.Genesis'
  | 'Doc.History.List'
  | 'Doc.History.List.Detail'
  | 'Doc.History.List.NavPaging';
export type InfoFieldCtx = { fields: t.InfoField[]; theme: t.CommonTheme };

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
  ref?: t.Doc | t.UriString;
  uri?: InfoDataDocUri;
  object?: InfoDataDocObject;
  head?: { label?: string; hashLength?: number };
  history?: InfoDataDocHistory;
};

export type InfoDataDocObject = {
  visible?: boolean;
  lens?: t.ObjectPath;
  name?: string;
  expand?: { level?: number; paths?: string[] };
  dotMeta?: boolean; // Default true. Deletes a [.meta] field if present.
  beforeRender?: (mutate: O) => void | O;
  onToggleClick?(e: { uri: t.UriString; modifiers: t.KeyboardModifierFlags }): void;
};

export type InfoDataDocUri = {
  shorten?: number | [number, number];
  prefix?: string | null;
  head?: boolean | number;
  clipboard?: boolean;
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

export type InfoStatefulChangeAction = 'Toggle:Visible' | 'Toggle:ObjectVisible';
export type InfoStatefulChangeHandler = (e: InfoStatefulChangeHandlerArgs) => void;
export type InfoStatefulChangeHandlerArgs = {
  readonly action: InfoStatefulChangeAction;
  readonly fields: InfoField[];
  readonly data: InfoData;
};
