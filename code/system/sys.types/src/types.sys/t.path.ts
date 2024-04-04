import type { t } from '../common';

export type ObjectPath = (string | t.Index)[];

/**
 * A version of <ObjectPath> that is strongly typed to an {object} hierarchy.
 */
export type TypedObjectPath<T> = T extends object
  ? { [K in keyof T]: [K, ...TypedObjectPath<T[K]>] | [K] }[keyof T]
  : [];
