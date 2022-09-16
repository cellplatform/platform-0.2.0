import { equals } from 'ramda';
import { animationFrameScheduler, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, observeOn, takeUntil } from 'rxjs/operators';

import * as t from '../common/types.mjs';
import { rx } from '../common/index.mjs';

const RECT: t.DomRect = {
  x: -1,
  y: -1,
  width: -1,
  height: -1,
  top: -1,
  right: -1,
  bottom: -1,
  left: -1,
};
export const DEFAULT = { RECT };

/**
 * An observer that monitors the changing size of an HTML element.
 * Uses:
 *    https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 */
export const ResizeObserver = (el?: HTMLElement | null): t.ResizeObserver => {
  const root$ = new Subject<t.ResizeObserverEvent>();
  const dispose$ = new Subject<void>();

  type Item = {
    element: t.ResizeElementObserver;
    next(e: t.ResizeObserverEvent): void;
  };
  let items: Item[] = [];
  const findByTarget = (el: HTMLElement) => items.find((item) => item.element.target === el);

  const createItem = (target: HTMLElement) => {
    const item$ = new Subject<t.ResizeObserverEvent>();
    const dispose$ = new Subject<void>();
    const dispose = () => {
      items = items.filter((item) => item.element.target !== target);
      item$.complete();
      dom.unobserve(target);
      rx.done(dispose$);
    };
    api.dispose$.subscribe(dispose);

    let rect: t.DomRect = DEFAULT.RECT;
    const $ = item$.pipe(takeUntil(dispose$), observeOn(animationFrameScheduler));
    const element: t.ResizeElementObserver = {
      $,
      target,
      dispose$: dispose$.asObservable(),
      get rect() {
        return rect;
      },
      refresh() {
        const rect = target.getBoundingClientRect();
        item.next(toSizeEvent(target, rect));
        return rect;
      },
      dispose,
    };
    const item: Item = { element, next: (e) => item$.next(e) };

    item$
      .pipe(
        filter((e) => e.type === 'ResizeObserver/size'),
        map((e) => e as t.ResizeObserverSizeEvent),
        distinctUntilChanged((prev, next) => equals(prev.payload.rect, next.payload.rect)),
      )
      .subscribe((e) => {
        rect = e.payload.rect;
        root$.next(e); // NB: Pipe into the root observable.
      });

    dom.observe(target);
    items.push(item);
    return item;
  };

  const toSizeEvent = (target: HTMLElement, rect: t.DomRect): t.ResizeObserverSizeEvent => {
    const { x, y, width, height, top, right, bottom, left } = rect;
    return {
      type: 'ResizeObserver/size',
      payload: {
        target,
        rect: { x, y, width, height, top, right, bottom, left },
      },
    };
  };

  const dom = new (window as any).ResizeObserver((entries: any) => {
    entries.forEach((e: any) => {
      const target = e.target;
      const item = findByTarget(target);
      if (item) {
        const event = toSizeEvent(item.element.target, e.contentRect);
        item.next(event);
      }
    });
  });

  const api = {
    $: root$.pipe(takeUntil(dispose$)),
    dispose$: dispose$.asObservable(),

    get elements() {
      return items.map((item) => item.element);
    },

    dispose() {
      items.forEach((item) => item.element.dispose());
      dom.disconnect();
      dispose$.next();
      dispose$.complete();
    },

    watch(target: HTMLElement) {
      return findByTarget(target)?.element || createItem(target).element;
    },

    unwatch(target: HTMLElement) {
      findByTarget(target)?.element.dispose();
    },

    refresh(target?: HTMLElement) {
      if (target) findByTarget(target)?.element.refresh();
      if (!target) api.elements.forEach((el) => el.refresh());
    },
  };

  if (el) api.watch(el);
  return api;
};
