import type { t } from '../common.t';

export type CrdtInfoFields = 'Module' | 'Driver' | 'File' | 'History.Total' | 'History.Item';

export type CrdtInfoData = {
  file?: { data?: t.CrdtDocFile<any>; title?: string };
  history?: {
    title?: string;
    data?: t.CrdtDocHistory<any>[];
    item?: { data: t.CrdtDocHistory<any>; title?: string };
  };
};
