import type { t } from './common';

export type CrdtInfoField =
  | 'Module'
  | 'Module.Verify'
  | 'Driver.Library'
  | 'Driver.Runtime'
  | 'File'
  | 'File.Driver'
  | 'Network'
  | 'History'
  | 'History.Item'
  | 'History.Item.Message'
  | 'Url'
  | 'Url.QRCode';

export type CrdtInfoData = {
  file?: { doc?: t.CrdtDocFile<any>; title?: string; path?: string };
  network?: { doc?: t.CrdtDocSync<any> };
  url?: { href: string; title?: string };
  history?: t.CrdtHistoryInfoData;
};
