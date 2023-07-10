import type { t } from '../common.t';

export type CrdtHistoryInfoData = {
  title?: string;
  data?: t.CrdtDocHistory<any>[];
  item?: { data: t.CrdtDocHistory<any>; title?: string };
};
