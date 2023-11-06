/**
 * Supporting UI
 */
import { CrdtHistory } from './Crdt.History';
import { CrdtInfo } from './Crdt.Info';

export { CrdtHistory, CrdtInfo };

export const CrdtViews = {
  Info: CrdtInfo,
  History: CrdtHistory,
} as const;
