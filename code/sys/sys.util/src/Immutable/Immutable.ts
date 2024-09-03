import { cloner, clonerRef } from './Immutable.cloner';
import { viaObservable, viaOverride } from './Immutable.events';
import { map } from './Immutable.map';
import { Is, toObject } from './u';

/**
 * Helpers for working with raw Immutable<T> objects.
 */
export const Immutable = {
  Is,
  cloner,
  clonerRef,
  map,
  events: { viaOverride, viaObservable },
  toObject,
} as const;
