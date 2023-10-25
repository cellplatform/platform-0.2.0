import { LabelItem } from './common';

export * from '../common';
export const Model = LabelItem.Stateful.Model;

/**
 * Constants
 */
export const DEFAULTS = {
  timeout: {
    error: 3500,
    closePending: 2500,
    copiedPending: 1200,
  },
} as const;
