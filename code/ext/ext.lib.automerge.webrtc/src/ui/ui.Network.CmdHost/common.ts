import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
export const paths: t.CmdHostPaths = {
  uri: { selected: ['uri', 'selected'], loaded: ['uri', 'loaded'] },
  cmd: { text: ['cmd', 'text'] },
};

export const DEFAULTS = {
  displayName: 'Network.CmdHost',
  paths,
} as const;
