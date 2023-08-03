import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
const data: t.VideoLayout = {
  position: ['center', 'bottom'],
};

export const DEFAULTS = {
  data,
} as const;
