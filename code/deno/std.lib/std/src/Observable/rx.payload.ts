import type { t } from '../common.ts';
import { filter, map } from './rxjs.lib.ts';
import { Is } from './rxjs.Is.ts';

type Event = { type: string; payload: unknown };

/**
 * Filters on the given event.
 */
export function event<E extends Event>($: t.Observable<unknown>, type: E['type']) {
  return $.pipe(
    filter((e) => Is.event(e)),
    filter((e: any) => e.type === type),
    map((e: any) => e as E),
  );
}

/**
 * Filters on the given event returning the payload.
 */
export function payload<E extends Event>($: t.Observable<unknown>, type: E['type']) {
  return $.pipe(
    filter((e) => Is.event(e)),
    filter((e: any) => e.type === type),
    map((e: any) => e.payload as E['payload']),
  );
}
