import { cloner, clonerRef } from './Immutable.cloner';
import { overrideChange } from './Immutable.event';

/**
 * Helpers for working with raw Immutable<T> objects.
 */
export const Immutable = {
  cloner,
  clonerRef,
  events: { overrideChange },
} as const;
