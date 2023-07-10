/**
 * Supporting UI
 */
import { CrdtHistory } from './Crdt.History';
import { CrdtInfo } from './Crdt.Info';
import { CrdtNamespace } from './Crdt.Namespace';

export { CrdtHistory, CrdtInfo, CrdtNamespace };

export const CrdtView = {
  Info: CrdtInfo,
  Namespace: CrdtNamespace,
  History: CrdtHistory,
} as const;
