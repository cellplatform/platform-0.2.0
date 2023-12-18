import type { t } from './common';

export type InfoField = 'Module' | 'Module.Verify' | 'Component' | 'Repo';

export type InfoData = {
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
  repo?: {
    label?: string;
    name?: string;
    store?: t.WebStore;
    index?: t.StoreIndexState;
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
