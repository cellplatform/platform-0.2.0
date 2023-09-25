import type * as t from './types.mjs';
import { Value } from './libs';

export const srcKinds: t.VideoSrcKind[] = ['Unknown', 'Video', 'Vimeo', 'YouTube'];

/**
 * Flags
 */
export const Is = {
  srcObject(input: any): input is t.VideoSrc {
    if (typeof input !== 'object' || input === null) return false;
    if (typeof input.src !== 'string') return false;
    return srcKinds.some((kind) => input.kind === kind);
  },

  numeric(input: string) {
    return Value.is.numeric(input);
  },

  http(input: string, forceHttps?: boolean) {
    return Value.is.http(input, forceHttps);
  },
} as const;
