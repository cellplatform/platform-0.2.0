import { type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const strategy: t.EditorUpdateStrategy = 'Splice';
const paths: t.EditorPaths = {
  text: ['text'],
  cmd: ['.tmp', 'cmd'],
  identity: ['.tmp', 'identity'],
};

const Symbols = {
  cmd: Symbol('cmd'),
};

export const DEFAULTS = {
  strategy,
  paths,
  Symbols,
} as const;
