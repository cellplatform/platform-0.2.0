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
  image: {
    // NB: "group scale"
    src: 'https://user-images.githubusercontent.com/185555/208217954-0427e91d-fcb3-4e9a-b5f1-1f86ed3500bf.png',
  },
};

export const DEFAULTS = {
  videoHeight: 200,
  position,
  sample,
} as const;
