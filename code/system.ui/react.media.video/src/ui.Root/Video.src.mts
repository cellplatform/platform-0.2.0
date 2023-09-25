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
    if (Is.numeric(src)) return { kind: 'Vimeo', src };
    if (Is.http(src)) {
      if (!Is.http(src, true)) throw new Error(`Only https supported.`);
      return { kind: 'Video', src };
    }
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
} as const;
