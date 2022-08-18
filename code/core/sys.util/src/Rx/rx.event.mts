import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

type Event = { type: string; payload: unknown };

/**
 * Filters on the given event.
 */
export function event<E extends Event>(ob$: Observable<unknown>, type: E['type']) {
  return ob$.pipe(
    filter((e: any) => e.type === type),
    map((e: any) => e as E),
  );
}

/**
 * Filters on the given event returning the payload.
 */
export function payload<E extends Event>(ob$: Observable<unknown>, type: E['type']) {
  return ob$.pipe(
    filter((e: any) => e.type === type),
    map((e: any) => e.payload as E['payload']),
  );
}

/**
 * Determine if the given object is the shape of
 * a standard [Event], eg:
 *
 *    {
 *      type: string,
 *      payload: { ... }
 *    }
 *
 */
export function isEvent(input: any, type?: string | { startsWith: string }): boolean {
  if (
    !(
      input !== null &&
      typeof input === 'object' &&
      typeof input.type === 'string' &&
      typeof input.payload === 'object'
    )
  ) {
    return false;
  }

  if (type === null) return false;

  if (type !== undefined) {
    const event = input as Event;

    if (typeof type === 'object') {
      if (typeof type.startsWith !== 'string') return false;
      return event.type.startsWith(type.startsWith);
    } else {
      if (typeof type !== 'string') return false;
      if (event.type !== type) return false;
    }
  }

  return true;
}
