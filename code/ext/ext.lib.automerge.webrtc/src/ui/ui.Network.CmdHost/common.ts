import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
export const paths: t.CmdHostPaths = {
  cmd: ['cmd'],
  uri: ['uri'],
  selected: ['selected'],
};

export const DEFAULTS = {
  displayName: 'Network.CmdHost',
  paths,
} as const;
