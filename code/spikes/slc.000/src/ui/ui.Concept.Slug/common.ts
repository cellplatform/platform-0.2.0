import { type t } from './common';
export * from '../common';
export { Position } from '../ui.Position';

/**
 * Constants
 */
const position: t.Pos = ['center', 'center'];

const sample: t.ConceptSlug = {
  id: 'sample',
  video: {
    id: 499921561, //→ vimeo/tubes
    position: ['left', 'bottom'],
  },
  image: {},
};

export const DEFAULTS = {
  position,
  sample,
} as const;
