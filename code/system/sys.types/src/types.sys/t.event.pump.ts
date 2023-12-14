import type { Event } from './t.event';

/**
 * A two-way message pump that can ferry events IN and OUT between buses.
 * NOTE:
 *    This is a useful way of reducing Observable libraries (eg "rxjs") down to
 *    the simple functions, a bridging between them, ensuring competing
 *    versions of the same library do not fight with each other.
 */
export type EventPump<E extends Event = Event> = {
  id: string;
  in: EventPumpIn<E>; //   Recieved "INWARD" from the subject bus.
  out: EventPumpOut<E>; // Fires "OUTWARD" from the subject bus.
};

/**
 * Registers a handler to respond to messages/events coming inward toward the "subject".
 */
export type EventPumpIn<E extends Event> = (fn: EventPumpInSubscriber<E>) => void;
export type EventPumpInSubscriber<T extends Event> = (e: T) => void;

/**
 * Pumps messages/events outward through the "subject".
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
