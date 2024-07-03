import { cloner, clonerRef } from './Immutable.cloner';
import { changeOverriden } from './Immutable.event';

/**
 * Helpers for working with raw Immutable<T> objects.
 */
export const Immutable = {
  cloner,
  clonerRef,
  events: { changeOverriden },
} as const;
