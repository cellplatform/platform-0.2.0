import type { t } from './common';

export { CmdHost } from 'sys.ui.react.common';
export * from '../common';

/**
 * Constants
 */
export const paths: t.CmdHostPaths = {
  uri: { selected: ['uri', 'selected'], loaded: ['uri', 'loaded'] },
  cmd: { text: ['cmd', 'text'], invoked: ['cmd', 'invoked'] },
};

export const DEFAULTS = {
  displayName: 'Network.CmdHost',
  paths,
} as const;
