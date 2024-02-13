import { useEffect, useRef, useState } from 'react';
import { rx, type t } from './common';
import { Wrangle } from './u.Wrangle';

export function useLoader(props: t.ModuleLoaderStatefulProps) {
  const theme = Wrangle.theme(props);
  const name = props.name ?? '';
  const factoryRef = useRef(props.factory);

  const [front, setFront] = useState<t.RenderOutput>(null);
  const [back, setBack] = useState<t.RenderOutput>(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    // NB: this is done so we don't need to use the `props.factory` in the loader effect deps.
    factoryRef.current = props.factory;
  }, [props.factory]);

  useEffect(() => {
    const life = rx.lifecycle();
    const factory = factoryRef.current;

    const load = async (face: t.ModuleLoaderFace, done: (el: t.RenderOutput) => void) => {
      if (!factory) return done(null);

      setSpinning(true);
      const is = { front: face === 'Front', back: face === 'Back' };
      const res = await factory({ theme, name, face, is });
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
