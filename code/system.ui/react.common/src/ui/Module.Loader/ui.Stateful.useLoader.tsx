import { useEffect, useRef, useState } from 'react';
import { rx, type t } from './common';
import { Wrangle } from './u.Wrangle';

export function useLoader(props: t.ModuleLoaderStatefulProps) {
  const theme = Wrangle.theme(props);
  const name = props.name ?? '';

  const factoryRef = useRef(props.factory);
  const ctxRef = useRef(props.ctx);

  const [element, setElement] = useState<t.RenderOutput>(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    // NB: this is done so we don't need to use the `props.factory` in the loader effect deps.
    factoryRef.current = props.factory;
    ctxRef.current = props.ctx;
  }, [props.factory, props.ctx]);

  useEffect(() => {
    const life = rx.lifecycle();
    const factory = factoryRef.current;

    const load = async () => {
      if (!factory) return setElement(null);

      setSpinning(true);
      const is: t.ModuleFactoryFlags = {
        dark: theme === 'Dark',
        light: theme === 'Light',
      };
      const ctx = ctxRef.current ?? {};
      const res = await factory({ name, ctx, theme, is });
      if (life.disposed) return;
      setSpinning(false);

      setElement(res);
    };

    load();
    return life.dispose;
  }, [name, theme]);

  /**
   * API
   */
  return {
    // front: element ? { element: element } : undefined,
    element,
    spinning,
  } as const;
}
