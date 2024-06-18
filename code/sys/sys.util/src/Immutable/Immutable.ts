import { cloner, clonerRef } from './Immutable.clone';
import { events } from './Immutable.Events';

/**
 * Helpers for working with raw Immutable<T> objects.
 */
export const Immutable = {
  events,
  cloner,
  clonerRef,
} as const;
