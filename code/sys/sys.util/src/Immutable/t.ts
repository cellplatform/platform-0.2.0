import type { t } from './common';

/**
 * A JSON change/patch operation (RFC-6902) extended
 * with the address (URI) of the underlying mapped
 * document the patch pertains to.
 */
export type ImmutableMapPatch = t.PatchOperation & { mapping: ImmutableMapPatchInfo };
export type ImmutableMapPatchInfo = {
  key: string;
  doc: string;
};

/**
 * Takes a patch after a change operation and formats it
 * with identifying meta-data.
 */
export type ImmutableMapFormatPatch<P> = (e: t.ImmutableMapFormatPatchArgs<P>) => P;
export type ImmutableMapFormatPatchArgs<P> = {
  patch: P;
  key: string | symbol;
  doc: t.ImmutableRef;
};
