import { DocRef } from '../crdt.DocRef';
import { DocFile } from '../crdt.DocFile';

export const CrdtDoc = {
  DocRef,
  DocFile,

  ref: DocRef.init,
  file: DocFile.init,
};
