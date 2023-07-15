import { DocRef } from '../crdt.DocRef';
import { DocFile } from '../crdt.DocFile';
import { DocSync } from '../crdt.DocSync';
import { CrdtSchema as Schema } from '../crdt.Schema';
import { toObject } from '../helpers';

export const CrdtDoc = {
  Schema,
  DocRef,
  DocFile,
  DocSync,

  ref: DocRef.init,
  file: DocFile.init,
  sync: DocSync.init,

  toObject,
} as const;
