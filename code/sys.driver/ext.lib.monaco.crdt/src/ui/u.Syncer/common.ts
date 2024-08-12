import { type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const paths: t.EditorPaths = {
  text: ['text'],
  cmd: ['.tmp', 'cmd'],
  identity: ['.tmp', 'identity'],
};

const Symbols = {
  cmd: Symbol('cmd'),
};

export const DEFAULTS = {
  paths,
  Symbols,
  autopurge: { min: 50, max: 100 },
} as const;
