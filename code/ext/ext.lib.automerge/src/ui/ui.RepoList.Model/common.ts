import { LabelItem, Typenames } from './common';

export * from '../common';
export const Model = LabelItem.Stateful.Model;

/**
 * Constants
 */
export const DEFAULTS = {
  typename: Typenames.RepoList,
} as const;
