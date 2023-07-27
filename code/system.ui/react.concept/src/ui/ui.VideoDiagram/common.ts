import { type t } from './common';

export * from '../common';

/**
 * Constants
 */
const position: t.EdgePos = ['center', 'center'];
const imageSizing: t.ImageSizeStrategy = 'contain';

const sample: t.ConceptSlug = {
  id: 'sample',
  video: {
    id: 499921561, //→ vimeo/tubes
    position: ['left', 'bottom'],
    height: 280,
  },
  image: {
    // NB: "group scale" diagram.
    src: 'https://user-images.githubusercontent.com/185555/208217954-0427e91d-fcb3-4e9a-b5f1-1f86ed3500bf.png',
  },
};

export const DEFAULTS = {
  videoHeight: 200,
  imageSizing,
  position,
  sample,
} as const;
