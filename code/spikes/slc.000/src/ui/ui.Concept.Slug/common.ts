import { type t } from './common';
export * from '../common';
export { Position } from '../ui.Position';

/**
 * Constants
 */
const position: t.Pos = ['center', 'center'];

type Sample = {
  video: t.ConceptSlugVideo;
};
const sample: Sample = {
  video: {
    id: 499921561, //→ vimeo/tubes
    position: ['left', 'bottom'],
  },
};

export const DEFAULTS = {
  position,
  sample,
} as const;
