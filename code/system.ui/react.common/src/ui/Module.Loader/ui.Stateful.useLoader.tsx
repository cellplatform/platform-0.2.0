import { useEffect, useRef, useState } from 'react';
import { rx, type t } from './common';
import { Wrangle } from './u.Wrangle';

export function useLoader(props: t.ModuleLoaderStatefulProps) {
  const theme = Wrangle.theme(props);
  const name = props.name ?? '';

  const factoryRef = useRef(props.factory);
  const ctxRef = useRef(props.ctx);

  const [front, setFront] = useState<t.RenderOutput>(null);
  const [back, setBack] = useState<t.RenderOutput>(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    // NB: this is done so we don't need to use the `props.factory` in the loader effect deps.
    factoryRef.current = props.factory;
    ctxRef.current = props.ctx;
  }, [props.factory, props.ctx]);

  useEffect(() => {
    const life = rx.lifecycle();
    const factory = factoryRef.current;

    const load = async (face: t.ModuleLoaderFace, done: (el: t.RenderOutput) => void) => {
      if (!factory) return done(null);

      setSpinning(true);
      const is: t.ModuleFactoryFlags = {
        front: face === 'Front',
        back: face === 'Back',
        dark: theme === 'Dark',
        light: theme === 'Light',
      };
      const ctx = ctxRef.current ?? {};
      const res = await factory({ name, ctx, theme, face, is });
      if (life.disposed) return;
      setSpinning(false);

      done(res);
    };

    load('Front', setFront);
    load('Back', setBack);
    return life.dispose;
  }, [name, theme]);

  /**
   * API
   */
  return {
    front: front ? { element: front } : undefined,
    back: back ? { element: back } : undefined,
    spinning,
  } as const;
}
