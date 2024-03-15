import type { t } from './common';

export type InfoField =
  | 'Module'
  | 'Module.Verify'
  | 'Component'
  | 'Repo'
  | 'Doc'
  | 'Doc.URI'
  | 'Doc.Object'
  | 'History';

export type InfoData = {
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
  doc?: t.DocRef<unknown>;
  uri?: { shorten?: number | [number, number] };
  object?: { name?: string; expand?: { level?: number; paths?: string[] } };
  onIconClick?: (e: {}) => void;
};

export type InfoDataHistory = {
  label?: string;
  doc?: t.DocRef<unknown>;
};

/**
 * Component
 */
export type InfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: t.InfoField[];
  data?: t.InfoData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  flipped?: boolean;
  style?: t.CssValue;
};
