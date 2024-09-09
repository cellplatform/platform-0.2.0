import { useEffect, useState } from 'react';
import { DEFAULTS, Immutable, PropList, rx, type t } from './common';
import { Wrangle } from './u';

type P = t.InfoStatefulProps;

/**
 * Automerge <Info> Stateful Controller.
 */
export function useStateful(props: P): t.InfoStatefulController {
  const { repos = {} } = props;
  const ctx = Wrangle.ctx(props);
  const enabled = ctx.enabled;

  const [data, setData] = useState(wrangle.state(props));
  const [, setCount] = useState(0);
  const redraw = () => setCount((n) => n + 1);

  /**
   * Effects.
   */
  useEffect(() => {
    const instance = wrangle.propInstance(props);
    if (instance && data?.instance !== instance) setData(wrangle.state(props));
  }, [data?.instance, wrangle.propInstance(props)]);

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    if (data) props.onReady?.({ data, repos, dispose$ });
    return dispose;
  }, [data?.instance]);

  useEffect(() => {
    const events = data?.events();
    events?.changed$.pipe(rx.debounceTime(100)).subscribe(redraw);
    events?.changed$.subscribe(({ before, after }) => props.onChange?.({ before, after }));
    return events?.dispose;
  }, [data?.instance]);

  /**
   * Overriden event handlers.
   */
  const handlers: t.InfoPropsHandlers = {
    onDocToggleClick(e) {
      if (!enabled) return;
      data?.change((d) => {
        const document = Wrangle.Data.documents(d.document)[e.index];
        if (document) {
          const object = document.object || (document.object = {});
          object.visible = e.visible.next;
        }
      });
      props.onDocToggleClick?.(e);
      redraw();
    },

    onVisibleToggle(e) {
      if (!enabled) return;

      data?.change((d) => {
        const visible = d.visible || (d.visible = {});
        visible.value = e.next;
      });

      props.onVisibleToggle?.(e);
      redraw();
    },

    onHistoryItemClick(e) {
      if (!enabled) return;
      props.onHistoryItemClick?.(e);
      redraw();
    },
  };

  /**
   * API
   */
  const api: t.InfoStatefulController = {
    handlers,

    get props(): t.InfoProps {
      const data = api.data;
      const fields = api.fields;
      return { ...props, fields, data };
    },

    get data(): t.InfoData | undefined {
      return data?.current;
    },

    get fields(): t.InfoField[] {
      const fields = PropList.fields(props.fields, DEFAULTS.props.fields);
      const data = api.data;
      const isVisible = data?.visible?.value ?? true;
      const filter = data?.visible?.filter ?? DEFAULTS.visibleFilter;
      if (!data?.visible) return fields;
      if (isVisible) return fields;
      return filter({ visible: false, fields });
    },
  } as const;

  return api;
}

/**
 * Helpers
 */
const wrangle = {
  state(props: P): t.InfoStatefulData | undefined {
    if (!props.data) return;
    if (Immutable.Is.immutableRef(props.data)) return props.data;
    return Immutable.clonerRef<t.InfoData>(props.data);
  },

  propInstance(props: P) {
    if (!props.data) return '';
    return Immutable.Is.immutableRef(props.data) ? props.data.instance : '';
  },
} as const;
