import type { t } from './common';

type O = Record<string, unknown>;

export type ImmutableMapPatchDefault = t.ImmutableMapPatch<t.PatchOperation>;

/**
 * An private/internal API for operating on the map
 * that is not part of the main public interface.
 */
export type ImmutableMapInternal<T extends O, P> = {
  readonly mapping: t.ImmutableMapping<T, P>;
  origin(key: string | symbol): t.ImmutableMappingProp<T, P> | undefined;
};
