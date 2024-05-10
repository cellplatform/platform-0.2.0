export * from '../common';
export { Wrangle } from '../crdt.DocRef/Wrangle.mjs';
export { toObject } from '../helpers';

/**
 * Constants
 */
export const DEFAULTS = {
  ensureLensMessage: '[sys] ensure lens sub-tree',
} as const;
