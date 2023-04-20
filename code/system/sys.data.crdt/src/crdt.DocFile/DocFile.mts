import { createDocFile } from './DocFile.init.mjs';
import { toObject } from '../crdt.helpers';

/**
 * Extends a CRDT [DocRef] with file-system persistence.
 */
export const DocFile = {
  init: createDocFile,
  toObject,
};
