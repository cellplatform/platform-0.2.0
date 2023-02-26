import { DocRef } from '../crdt.DocRef';
import { DocFile } from '../crdt.DocFile';

export const CrdtDoc = {
  DocFile,
  ref: DocRef,
  file: DocFile.init,
};
