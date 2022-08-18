import { Observable } from 'rxjs';
declare type O = Record<string, unknown>;
/**
 * The canonical event structure.
 */
export declare type Event<P extends O = any> = {
    type: string;
    payload: P;
};
/**
 * A function that can fire an event through a bus.
 */
export declare type FireEvent<E extends Event = Event> = (event: E) => void;
/**
 * An structure that exposes an observable and can fire events.
 */
export declare type EventBus<E extends Event = Event> = {
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
export declare type EventPump<E extends Event = Event> = {
    id: string;
    in: EventPumpIn<E>;
    out: EventPumpOut<E>;
};
/**
 * Recieves messages/events inward.
 */
export declare type EventPumpIn<E extends Event> = (fn: EventPumpInSubscriber<E>) => void;
export declare type EventPumpInSubscriber<T extends Event> = (e: T) => void;
/**
 * Pumps messages/events outward.
 */
export declare type EventPumpOut<E extends Event> = (e: E) => void;
/**
 * Filter messages flowing through an EventPump.
 */
export declare type EventPumpDirection = 'In' | 'Out';
export declare type EventPumpFilter<E extends Event = Event> = (e: EventPumpFilterArgs<E>) => boolean;
export declare type EventPumpFilterArgs<E extends Event = Event> = {
    direction: EventPumpDirection;
    event: E;
};
export {};
