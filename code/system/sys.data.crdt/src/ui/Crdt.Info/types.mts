import type { t } from '../common.t';

export type CrdtInfoFields = 'Module' | 'Driver' | 'History.Total' | 'History.Item';

export type CrdtInfoData = {
  history?: {
    data?: t.CrdtDocHistory<any>[];
    item?: { data: t.CrdtDocHistory<any>; title?: string };
  };
};
