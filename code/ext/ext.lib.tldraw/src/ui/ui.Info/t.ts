import type { t } from './common';

export type InfoField = 'Module' | 'Module.Verify' | 'Component';

export type InfoData = {
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
};
