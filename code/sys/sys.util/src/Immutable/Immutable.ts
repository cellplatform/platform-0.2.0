import { cloner, clonerRef } from './Immutable.cloner';
import { viaOverride, viaObservable } from './Immutable.event';
import { Is } from './u';

/**
 * Helpers for working with raw Immutable<T> objects.
 */
export const Immutable = {
  Is,
  cloner,
  clonerRef,
  events: { viaOverride, viaObservable },
} as const;
