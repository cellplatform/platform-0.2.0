import { DocRef } from '../crdt.DocRef';
import { DocFile } from '../crdt.DocFile';
import { DocSync } from '../crdt.Sync';

export const CrdtDoc = {
  DocRef,
  DocFile,
  DocSync,

  ref: DocRef.init,
  file: DocFile.init,
  sync: DocSync.init,
};
