import { LabelItem } from './common';

export * from '../common';
export const Model = LabelItem.Stateful.Model;

/**
 * Constants
 */
export const DEFAULTS = {
  errorTimeout: 3500,
} as const;
