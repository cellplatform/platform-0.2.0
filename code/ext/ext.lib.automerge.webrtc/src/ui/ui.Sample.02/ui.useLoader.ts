import { useEffect, useState } from 'react';
import { type t } from './common';

export function useLoader(props: {
  store: t.Store;
  lens: t.Lens<t.SampleSharedOverlay>;
  factory: t.LoadFactory;
}) {
  const { lens, store, factory } = props;
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState<JSX.Element>();

  useEffect(() => {
    setBody(undefined);
    setLoading(false);
    const events = lens.events();

    events.changed$.subscribe(async (e) => {
      const m = e.after.module;
      const typename = m?.typename;
      const docuri = m?.docuri;

      setBody(undefined);
      if (!typename || !docuri) return;

      setLoading(true);
      const el = await factory({ typename, docuri, store });
      setBody(el || undefined);
      setLoading(false);
    });

    return events.dispose;
  }, [lens.instance]);

  return { loading, body } as const;
}
