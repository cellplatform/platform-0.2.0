import * as t from '../common/types.mjs';

/**
 * Programmatic wrapper around the W3C [ResizeObserver] object.
 */
export type ResizeObserver = t.Disposable & {
  readonly $: t.Observable<ResizeObserverEvent>;
  readonly elements: ResizeElementObserver[];
  watch(target: HTMLElement): ResizeElementObserver;
  unwatch(target: HTMLElement): void;
  refresh(): void;
};

export type ResizeElementObserver = t.Disposable & {
  readonly $: t.Observable<ResizeObserverEvent>;
  readonly target: HTMLElement;
  readonly rect: t.DomRect;
  dispose(): void;
  refresh(): t.DomRect;
};

/**
 * Events
 */
export type ResizeObserverEvent = ResizeObserverSizeEvent;

export type ResizeObserverSizeEvent = { type: 'ResizeObserver/size'; payload: ResizeObserverSize };
export type ResizeObserverSize = { rect: t.DomRect; target: HTMLElement };
