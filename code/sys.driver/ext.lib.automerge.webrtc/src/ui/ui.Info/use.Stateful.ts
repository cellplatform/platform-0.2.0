import { useEffect, useState } from 'react';
import { CrdtInfo, DEFAULTS, Doc, Immutable, PropList, rx, type t } from './common';
import { Shared, Wrangle } from './u';

type P = t.InfoStatefulProps;
type D = t.CrdtInfoData;

/**
 * Automerge.WebRTC <Info> Stateful Controller.
 */
export function useStateful(props: P) {
  const { network } = props;
  const ctx = Wrangle.ctx(props);
  const enabled = ctx.enabled;

  const [networkId, setNetworkId] = useState('');
  const [data, setData] = useState<t.InfoStatefulData>();
  const [sharedDoc, setSharedDoc] = useState<t.DocMap<D>>();
  const [, setCount] = useState(0);
  const redraw = () => setCount((n) => n + 1);

  /**
   * Sub-controllers.
   */
  const controller = {
    shared: CrdtInfo.useStateful({ data: sharedDoc }),
  } as const;

  /**
   * Effects.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    if (data) props.onReady?.({ data, dispose$ });
    return dispose;
  }, [data?.instance]);

  useEffect(() => {
    /**
     * The main {data} configuration for the component.
     */
    const instance = wrangle.dataInstance(props);
    let doReset = false;
    if (!data) doReset = true;
    if (instance && data?.instance !== instance) doReset = true;
    if (network?.peer.id !== networkId) doReset = true;
    if (doReset) {
      setData(wrangle.data(props));
      setNetworkId(network?.peer.id ?? '');
    }
  }, [data?.instance, wrangle.dataInstance(props), networkId]);

  useEffect(() => {
    /**
     * The {map} proxy for the embedded CRDT document <Info>.
     */
    if (!data) return;
    setSharedDoc(undefined);

    const map = Doc.map<D>({ document: [data, 'shared'] });
    map.change((d) => (d.document = d.document || (d.document = Shared.default())));

    setSharedDoc(map);
  }, [data?.instance]);

  /**
   * Overriden event handlers.
   */
  const handlers: t.InfoPropsHandlers = {
    onVisibleToggle(e) {
      if (!enabled) return;

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

    get props() {
      const data = api.data;
      const fields = api.fields;
      const view: t.InfoProps = { ...props, fields, data };

      const stateful: t.InfoPropsStateful = {
        shared: controller.shared,
      };

      return { view, stateful } as const;
    },

    get data(): t.InfoData | undefined {
      return data?.current;
    },

    get fields(): t.InfoField[] {
      const fields = PropList.fields(props.fields, DEFAULTS.props.fields);
      const data = api.data;
      const isVisible = data?.visible?.value ?? true;
      const filter = data?.visible?.filter ?? DEFAULTS.fields.visibleFilter;
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
  data(props: P): t.InfoStatefulData | undefined {
    if (Immutable.Is.immutableRef(props.data)) return props.data;
    return Immutable.clonerRef<t.InfoData>(props.data ?? {});
  },

  dataInstance(props: P) {
    if (!props.data) return '';
    return Immutable.Is.immutableRef(props.data) ? props.data.instance : '';
  },
} as const;
