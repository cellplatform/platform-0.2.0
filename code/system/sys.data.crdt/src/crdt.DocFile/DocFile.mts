import { createDocFile } from './DocFile.init.mjs';

/**
 * Extends a CRDT [DocRef] with file-system persistence.
 */
export const DocFile = {
  init: createDocFile,
};
