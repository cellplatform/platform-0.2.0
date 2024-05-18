import { CommonInfoFields as Fields } from './Common.Info.Fields';
import { DEFAULTS } from './common';
import { Wrangle } from './u';

/**
 * Common helpers and configuration for an <Info> panel.
 */
export const CommonInfo = {
  DEFAULTS,
  Fields,
  Wrangle,
  title: Wrangle.title,
  width: Wrangle.width,
} as const;
