import type { t } from './common';

export type InfoField = 'Module' | 'Module.Verify' | 'Component' | 'Repo';

export type InfoData = {
  url?: { href: string; title?: string };
  component?: { name?: string };
  repo?: {
    label?: string;
    name?: string;
    store?: t.WebStore;
    index?: t.StoreIndex;
  };
};
