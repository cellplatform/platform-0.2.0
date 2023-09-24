import { type t, Is } from '../common';

/**
 * Convert a loose input into a stongly typed video source.
 */
export function src(input?: t.VideoSrcInput): t.VideoSrc {
  if (Is.srcObject(input)) return input;

  if (typeof input === 'number') return { kind: 'Vimeo', src: `${input}` };

  if (typeof input === 'string') {
    const src = input.trim();
    if (!src) return Wrangle.unknown;
    if (Wrangle.isNumeric(input)) return { kind: 'Vimeo', src };
    return { kind: 'YouTube', src };
  }

  return Wrangle.unknown;
}

/**
 * Helpers
 */
const Wrangle = {
  get unknown(): t.VideoSrcUnknown {
    return { kind: 'Unknown', src: '' };
  },

  isNumeric(input: string) {
    return !isNaN(Number(input));
  },
} as const;
