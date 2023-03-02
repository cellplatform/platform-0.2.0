import { t } from '../../../common.t';
export * from '../../../common/types.mjs';

/**
 * Sample code document.
 */
export type SampleDoc = {
  count: number;
  code: t.AutomergeText;
};

export type DevPeer = {
  name: string;
  doc: t.CrdtDocRef<SampleDoc>;
};
