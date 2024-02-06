import { useEffect, useState } from 'react';
import { type t } from './common';

export function useLoader(props: {
  store: t.Store;
  shared: t.Lens<t.SampleSharedMain>;
  factory: t.LoadFactory;
}) {
  const { shared, store, factory } = props;
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState<JSX.Element>();

  useEffect(() => {
    setBody(undefined);
    setLoading(false);
    const events = shared.events();

    events.changed$.subscribe(async (e) => {
      const m = e.after.module;
      const typename = m?.typename;
      const docuri = m?.docuri;

      setBody(undefined);
      if (!typename || !docuri) return;

      setLoading(true);
      const el = await factory({ typename, docuri, store, shared });
      setBody(el || undefined);
      setLoading(false);
    });

    return events.dispose;
  }, [shared.instance]);

  return { loading, body } as const;
}
