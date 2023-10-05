import { Path, type t, Is } from '../common';

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
    if (Is.http(ref)) return Wrangle.toFileSrc(ref);
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

  mimetype(path: string): t.VideoMimeType {
    const ext = Path.parts(path).ext.toLowerCase();
    if (ext === 'mp4') return 'video/mp4';
    if (ext === 'webm') return 'video/webm';
    return 'video/mp4';
  },

  toFileSrc(ref: string): t.VideoSrcFile {
    if (!Is.http(ref, true)) throw new Error(`Only https supported.`);
    const mimetype = Wrangle.mimetype(ref);
    return { kind: 'Video', ref, mimetype };
  },
} as const;
