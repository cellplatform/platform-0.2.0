import { useEffect, useState } from 'react';
import { DEFAULTS, Immutable, PropList, rx, type t } from './common';

type P = t.InfoStatefulProps;

/**
 * <Info> Stateful Controller.
 */
export function useStateful(props: P) {
  const { repos = {} } = props;
  const [data, setData] = useState(wrangle.state(props));

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
   * API
   */
  const api = {
    get props(): t.InfoProps {
      const data = api.data;
      const fields = api.fields;
      return { ...props, fields, data };
    },

    get data(): t.InfoData | undefined {
      return data?.current;
    },

    get fields(): t.InfoField[] {
      const fields = PropList.fields(props.fields, DEFAULTS.fields.default);

      /**
       * TODO 🐷 - see __use.Stateful.ts
       */

      return fields;
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
