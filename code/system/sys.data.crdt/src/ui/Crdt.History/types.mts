import { type t } from './common';

export type CrdtHistoryInfoData = {
  title?: string;
  data?: t.CrdtDocHistory<any>[];
  item?: { data: t.CrdtDocHistory<any>; title?: string };
};
