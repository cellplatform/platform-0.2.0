import { type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const strategy: t.EditorUpdateStrategy = 'Splice';
const paths: t.EditorPaths = {
  text: ['text'],
  selection: ['selection'],
};

export const DEFAULTS = {
  strategy,
  paths,
} as const;
