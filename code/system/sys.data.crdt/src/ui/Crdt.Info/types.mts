import type { t } from '../common.t';

export type CrdtInfoFields =
  | 'Module'
  | 'Module.Tests'
  | 'Driver'
  | 'Driver.Runtime'
  | 'File'
  | 'Network'
  | 'History'
  | 'History.Item'
  | 'Url';

export type CrdtInfoData = {
  file?: { doc?: t.CrdtDocFile<any>; title?: string; path?: string };
  network?: { doc?: t.CrdtDocSync<any> };
  history?: {
    title?: string;
    data?: t.CrdtDocHistory<any>[];
    item?: { data: t.CrdtDocHistory<any>; title?: string };
  };
};
