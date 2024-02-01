import type { t } from './common';

export type InfoField = 'Module' | 'Module.Verify' | 'Component' | 'Repo' | 'Doc' | 'Doc.URI';

export type InfoData = {
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
  repo?: { label?: string; name?: string; store?: t.Store; index?: t.StoreIndexState };
  document?: {
    label?: string;
    doc?: t.DocRef<unknown>;
    object?: { name?: string; expand?: { level?: number; paths?: string[] } };
  };
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
