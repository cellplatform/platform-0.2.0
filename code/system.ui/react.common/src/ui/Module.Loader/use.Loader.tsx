import { useEffect, useState } from 'react';
import { Is, rx, type t } from './common';
import { Wrangle } from './u.Wrangle';

type RenderOutput = JSX.Element | null | false;

export function useLoader(props: t.ModuleLoaderStatefulProps) {
  const theme = Wrangle.theme(props);

  const [front, setFront] = useState<RenderOutput>(null);
  const [back, setBack] = useState<RenderOutput>(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const life = rx.lifecycle();
    const factory = Wrangle.factoryProps(props);

    const factoryLoad = async (
      factory: t.ModuleLoaderFactory | undefined,
      done: (el: RenderOutput) => void,
    ) => {
      if (!factory) return done(null);

      setSpinning(true);
      const res = factory({ theme });
      const el = (Is.promise(res) ? await res : res) || null;
      if (life.disposed) return;

      setSpinning(false);
      done(el);
    };

    factoryLoad(factory?.front, setFront);
    factoryLoad(factory?.back, setBack);
    return life.dispose;
  }, [props.factory, theme]);

  /**
   * API
   */
  return {
    front: front ? { element: front } : undefined,
    back: back ? { element: back } : undefined,
    spinning,
  } as const;
}
