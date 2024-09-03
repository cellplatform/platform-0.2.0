import { cloner, clonerRef } from './Immutable.cloner';
import { viaObservable, viaOverride } from './Immutable.events';
import { Map } from './Immutable.map';
import { Is, toObject } from './u';

const map = Map.create;

/**
 * Helpers for working with raw Immutable<T> objects.
 */
export const Immutable = {
  Is,
  cloner,
  clonerRef,

  Map,
  map,

  events: { viaOverride, viaObservable },
  toObject,
} as const;
