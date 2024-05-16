import type { t } from '../common';

type O = Record<string, unknown>;

/**
 * The canonical event structure.
 */
export type Event<P extends O = any> = { type: string; payload: P };

/**
 * A function that can fire an event through a bus.
 */
export type FireEvent<E extends Event = Event> = (event: E) => void;

/**
 * A structure that exposes an observable and can fire events.
 */
export type EventBus<E extends Event = Event> = {
  readonly $: t.Observable<E>;
  fire: FireEvent<E>;
};
