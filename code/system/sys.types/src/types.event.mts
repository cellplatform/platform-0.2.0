import { Observable } from 'rxjs';

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
 * An structure that exposes an observable and can fire events.
 */
export type EventBus<E extends Event = Event> = {
  readonly $: Observable<E>;
  fire: FireEvent<E>;
};

/**
 * A two-way message pump that can ferry events IN and OUT between buses.
 * NOTE:
 *    This is a useful way of reducing Observable libraries (eg "rxjs") down to
 *    the simple functions, a bridging between them, ensuring competing
 *    versions of the same library do not fight with each other.
 */
export type EventPump<E extends Event = Event> = {
  id: string;
  in: EventPumpIn<E>;
  out: EventPumpOut<E>;
};

/**
 * Recieves messages/events inward.
 */
export type EventPumpIn<E extends Event> = (fn: EventPumpInSubscriber<E>) => void;
export type EventPumpInSubscriber<T extends Event> = (e: T) => void;

/**
 * Pumps messages/events outward.
 */
export type EventPumpOut<E extends Event> = (e: E) => void;

/**
 * Filter messages flowing through an EventPump.
 */
export type EventPumpDirection = 'In' | 'Out';
export type EventPumpFilter<E extends Event = Event> = (e: EventPumpFilterArgs<E>) => boolean;
export type EventPumpFilterArgs<E extends Event = Event> = {
  direction: EventPumpDirection;
  event: E;
};
