import { useEffect, useState } from 'react';
import { DEFAULTS, PropList, useObservableReset, useProxy, useRedraw, type t } from './common';
import { Diff } from './u';
import { useData } from './use.Data';
import { rebuild, type FireChanged } from './use.Stateful.Rebuild';

/**
 * Hook that when {stateful:true} manages
 * state internally to the <Info> component.
 */
export function useStateful(props: t.InfoProps) {
  const { stateful = DEFAULTS.props.stateful } = props;
  const fields = PropList.fields(props.fields);

  const redraw = useRedraw();
  const data = useData(props.data);
  const reset = useObservableReset(props.resetState$);
  const proxy = useProxy(data, Diff.document.isEqual, reset.count);
  const [ready, setReady] = useState(false);

  const fireChanged: FireChanged = (action) => {
    if (!stateful) return;
    props.onStateChange?.({ action, fields, data: api.data });
    redraw();
  };

  /**
   * Set overrides on immutable proxy.
   */
  useEffect(() => {
    if (!stateful || !api.ready) return;
    if (stateful) rebuild(proxy.state, fireChanged);
    redraw();
  }, [proxy.version, ready]);

  /**
   * Ensure overrides are configured when not stateful.
   */
  useEffect(() => reset.inc(), [stateful]);

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
