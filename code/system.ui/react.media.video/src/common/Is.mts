import type * as t from './types.mjs';

const srcKinds: t.VideoSrcKind[] = ['Unknown', 'Vimeo', 'YouTube'];

/**
 * Flags
 */
export const Is = {
  srcObject(input: any): input is t.VideoSrc {
    if (typeof input !== 'object' || input === null) return false;
    if (typeof input.src !== 'string') return false;
    return srcKinds.some((kind) => input.kind === kind);
  },
} as const;
