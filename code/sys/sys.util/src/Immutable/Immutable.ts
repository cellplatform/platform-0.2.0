import { cloner, clonerRef } from './Immutable.cloner';
import { viaOverride, viaObservable } from './Immutable.event';

/**
 * Helpers for working with raw Immutable<T> objects.
 */
export const Immutable = {
  cloner,
  clonerRef,
  events: { viaOverride, viaObservable },
} as const;
