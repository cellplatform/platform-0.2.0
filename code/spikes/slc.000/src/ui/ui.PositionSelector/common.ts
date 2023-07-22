import { type t } from './common';
export * from '../common';

const selected: t.Pos = ['left', 'top'];
const video: t.ConceptPlayerVideo = {};

/**
 * Constants
 */
export const DEFAULTS = {
  enabled: true,
  video,
  size: 150,
  selected,
} as const;
