import { type t, Is } from '../common';

/**
 * Convert a loose input into a stongly typed video source.
 */
export function src(input?: t.VideoSrcInput): t.VideoSrc {
  if (Is.srcObject(input)) return input;

  if (typeof input === 'number') return { kind: 'Vimeo', ref: `${input}` };

  if (typeof input === 'string') {
    const ref = input.trim();
    if (!ref) return Wrangle.unknown;
    if (Is.numeric(ref)) return { kind: 'Vimeo', ref };
    if (Is.http(ref)) {
      if (!Is.http(ref, true)) throw new Error(`Only https supported.`);
      return { kind: 'Video', ref };
    }
    return { kind: 'YouTube', ref };
  }

  return Wrangle.unknown;
}

/**
 * Helpers
 */
const Wrangle = {
  get unknown(): t.VideoSrcUnknown {
    return { kind: 'Unknown', ref: '' };
  },
} as const;
