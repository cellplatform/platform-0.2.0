type O = Record<string, unknown>;
type Uri = string;
type E = { type: string; payload: O };

/**
 * A two-way message pump that can ferry events IN and OUT of a network.
 */
export type NetworkPump<T extends E = E> = {
  in: NetworkIn<T>;
  out: NetworkOut<T>;
};

/**
 * Recieves messages/events inward from the network.
 */
export type NetworkIn<T extends E> = (fn: NetworkInSubscriber<T>) => void;
export type NetworkInSubscriber<T extends E> = (e: T) => void;

/**
 * Pumps messages/events outward into the network.
 */
export type NetworkOut<T extends E> = (e: NetworkOutArgs<T>) => void;
export type NetworkOutArgs<T extends E> = { event: T; targets: Uri[] };
