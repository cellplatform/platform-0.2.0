import { useEffect, useState } from 'react';
import { DEFAULTS, PropList, useObservableReset, useProxy, type t } from './common';
import { Diff } from './u';
import { useData } from './use.Data';
import { rebuild } from './use.Stateful.rebuild';

const diff = (prev: t.InfoData, next: t.InfoData) => Diff.isEqual(prev, next);

/**
 * Hook that when {stateful:true} manages
 * state internally to the <Info> component.
 */
export function useStateful(props: t.InfoProps) {
  const { stateful = DEFAULTS.stateful } = props;
  const fields = PropList.Wrangle.fields(props.fields);

  const data = useData(props.data);
  const reset = useObservableReset(props.resetState$);
  const proxy = useProxy(data, diff, reset.count);
  const [ready, setReady] = useState(false);

  const fireChanged = (action: t.InfoStatefulChangeAction) => {
    if (!stateful) return;
    props.onStateChange?.({ action, fields, data: api.data });
  };

  /**
   * Set overrides on immutable proxy.
   */
  useEffect(() => {
    if (!stateful || !api.ready) return;
    rebuild(proxy.state, fireChanged);
  }, [proxy.version, ready]);

  /**
   * Ensure overrides are configured when not stateful.
   */
  useEffect(() => {
    if (!stateful) reset.inc();
  }, [stateful]);

  /**
   * Ready.
   */
  useEffect(() => setReady(true), []);

  /**
   * API
   */
  const api = {
    ready: ready && proxy.ready,

    /**
     * Current data configuration.
     */
    get data() {
      return stateful ? proxy.state.current : data;
    },

    /**
     * Current fields (or filterd if stateful).
     */
    get fields() {
      if (!stateful) return fields;

      const data = api.data;
      if (!data.visible) return fields;

      const isVisible = data.visible.value ?? true;
      if (isVisible) return fields;

      const filter = data.visible?.filter ?? DEFAULTS.visibleFilter;
      return filter({ visible: false, fields });
    },
  } as const;
  return api;
}
