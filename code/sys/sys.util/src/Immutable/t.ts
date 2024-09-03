import type { t } from './common';

type O = Record<string, unknown>;
type MapPropName = string;
type MapToPath = t.ObjectPath | MapPropName;

/**
 * A mapping used to create single composite data object
 * out of paths pointing to sub-parts of other immutable references.
 */
export type ImmutableMapProp = [t.ImmutableRef, MapToPath];
export type ImmutableMap<T extends O> = { [K in keyof T]: ImmutableMapProp };
