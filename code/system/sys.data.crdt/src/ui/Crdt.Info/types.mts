import type { t } from '../common.t';

export type CrdtInfoFields =
  | 'Module'
  | 'Module.Verify'
  | 'Driver.Library'
  | 'Driver.Runtime'
  | 'File'
  | 'Network'
  | 'History'
  | 'History.Item'
  | 'Url'
  | 'Url.QRCode';

export type CrdtInfoData = {
  file?: { doc?: t.CrdtDocFile<any>; title?: string; path?: string };
  network?: { doc?: t.CrdtDocSync<any> };
  url?: { href: string; title?: string };
  history?: {
    title?: string;
    data?: t.CrdtDocHistory<any>[];
    item?: { data: t.CrdtDocHistory<any>; title?: string };
  };
};
