import type { t } from '../../../common.t';
export type * from '../../../common/t';

/**
 * Sample code document.
 */
export type SampleDoc = {
  count: number;
  code: t.AutomergeText;
  peers: t.EditorPeersState;
};

/**
 * Network peer
 */
export type DevPeer = {
  name: string;
  doc: t.CrdtDocRef<SampleDoc>;
};

/**
 *
 */
export type TestPeer = {
  doc: t.CrdtDocRef<SampleDoc>;
  editor: t.MonacoCodeEditor;
};
export type TestCtx = {
  peer1: TestPeer;
  peer2: TestPeer;
};
