import { type t, Is } from '../common';

/**
 * Convert a loose input into a stongly typed video source.
 */
export function src(input?: t.VideoSrcInput): t.VideoSrc {
  if (Is.srcObject(input)) return input;

  if (typeof input === 'number') return { kind: 'Vimeo', id: `${input}` };

  if (typeof input === 'string') {
    const id = input.trim();
    if (!id) return Wrangle.unknown;
    if (Wrangle.isNumeric(input)) return { kind: 'Vimeo', id };
    return { kind: 'YouTube', id };
  }

  return Wrangle.unknown;
}

/**
 * Helpers
 */
const Wrangle = {
  get unknown(): t.VideoSrcUnknown {
    return { kind: 'Unknown', id: '' };
  },

  isNumeric(input: string) {
    return !isNaN(Number(input));
  },
} as const;
