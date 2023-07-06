import { useEffect, useState } from 'react';
import { load } from './Font.load.mjs';

import { type t } from './common';
import { Util } from './util.mjs';

/**
 * Hook for ensuring fonts are loaded within the document.
 */
export function useFont(
  definition: t.FontDefinition | t.FontDefinition[],
  options: { onReady?: () => void } = {},
) {
  const [fonts, setFonts] = useState<FontFace[]>([]);
  const [ready, setReady] = useState(false);

  const defs = Array.isArray(definition) ? definition : [definition].sort();
  const keys = defs.map((def) => Util.toKeyString(def)).join(';');

  useEffect(() => {
    let isDisposed = false;

    load(definition).then((fonts) => {
      if (!isDisposed) {
        setReady(true);
        setFonts(fonts);
        options.onReady?.();
      }
    });

    return () => {
      isDisposed = true;
    };
  }, [keys]); // eslint-disable-line

  return {
    ready,
    fonts,
  };
}
