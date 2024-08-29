import { useEffect, useState } from 'react';
import { DEFAULTS, Immutable, PropList, rx, type t } from './common';
import { Wrangle } from './u';

type P = t.InfoStatefulProps;

/**
 * <Info> Stateful Controller.
 */
export function useStateful(props: P) {
  const { repos = {} } = props;
  const [data, setData] = useState(wrangle.state(props));
  const [, setCount] = useState(0);
  const redraw = () => setCount((n) => n + 1);
  const ctx = Wrangle.ctx(props);

  /**
   * Effects.
   */
  useEffect(() => {
    const propsInstance = wrangle.propsInstance(props);
    if (propsInstance && data?.instance !== wrangle.propsInstance(props)) {
      setData(wrangle.state(props));
    }
  }, [data?.instance, wrangle.propsInstance(props)]);

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    if (data) props.onReady?.({ data, repos, dispose$ });
    return dispose;
  }, [data?.instance]);

  /**
   * Overriden event handlers.
   */
  const handlers: t.InfoHandlers = {
    onDocToggleClick(e) {
      if (!ctx.enabled) return;
      data?.change((d) => {
        const document = Wrangle.Data.document.list(d.document)[e.index];
        if (document) {
          const object = document.object || (document.object = {});
          object.visible = e.visible.next;
        }
      });
      props.onDocToggleClick?.(e);
      redraw();
    },

    onVisibleToggle(e) {
      if (!ctx.enabled) return;

      data?.change((d) => {
        const visible = d.visible || (d.visible = {});
        visible.value = e.next;
      });

      props.onVisibleToggle?.(e);
      redraw();
    },
  };

  /**
   * API
   */
  const api = {
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
    return Immutable.clonerRef<t.InfoData>(props.data as t.InfoData);
  },

  propsInstance(props: P) {
    if (!props.data) return '';
    return Immutable.Is.immutableRef(props.data) ? props.data.instance : '';
  },
} as const;
