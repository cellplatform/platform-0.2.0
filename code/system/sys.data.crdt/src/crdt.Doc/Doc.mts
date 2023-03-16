import { DocRef } from '../crdt.DocRef';
import { DocFile } from '../crdt.DocFile';
import { DocSync } from '../crdt.DocSync';
import { Schema } from '../crdt.DocRef/DocRef.Schema.mjs';
import { toObject } from '../crdt.helpers';

export const CrdtDoc = {
  Schema,
  DocRef,
  DocFile,
  DocSync,

  ref: DocRef.init,
  file: DocFile.init,
  sync: DocSync.init,

  toObject,
};
