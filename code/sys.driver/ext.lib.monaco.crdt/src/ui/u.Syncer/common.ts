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

const symbols = {
  cmd: Symbol('cmd'),
} as const;

export const DEFAULTS = {
  paths,
  symbols,
  autopurge: { min: 50, max: 100 },
} as const;
