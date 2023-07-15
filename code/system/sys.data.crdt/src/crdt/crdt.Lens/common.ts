export * from '../common';
export { Wrangle } from '../crdt.DocRef/Wrangle.mjs';
export { toObject } from '../crdt.helpers';

/**
 * Constants
 */
export const DEFAULTS = {
  ensureLensMessage: '[sys] ensure lens sub-tree',
} as const;
