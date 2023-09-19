import { useEffect, useState, useRef } from 'react';

import { type t, useDragTarget, Time } from './common';

/**
 * Upload a file when dropped.
 */
export function useDropFile(args: {}) {
  const [spinning, setSpinning] = useState(false);

  const drag = useDragTarget({
    async onDrop(e) {
      setSpinning(true);

      await Time.delay(1000, () => {
        setSpinning(false);
      });
    },
  });

  const label = drag.is.over ? 'Drop file...' : 'Drop file here';
  const is = { ...drag.is, spinning };

  /**
   * API
   */
  return {
    ref: drag.ref,
    is,
    label,
  } as const;
}
