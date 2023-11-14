import { LabelItem } from './common';

export * from '../common';
export const Model = LabelItem.Stateful.Model;

/**
 * Constants
 */
export const DEFAULTS = {
  typename: {
    list: 'RepoList.List1',
    item: 'RepoList.Item',
  },
} as const;
