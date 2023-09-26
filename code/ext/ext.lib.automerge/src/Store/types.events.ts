import { type t } from './common';

/**
 * Event API
 */
export type DocEvents<T> = t.Lifecycle & {
  // readonly $: t.Observable<t.DocEvent>;
};

/**
 * EVENTS
 */
export type DocEvent = DocChangedEvent;
export type DocChangedEvent = {
  type: 'crdt:DocChanged';
  payload: DocChanged;
};
export type DocChanged = {
  uri: t.DocUri;
};
