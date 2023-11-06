import { useState } from 'react';

/**
 * HOOK: provide simple counter incrementing component "redraw" API.
 */
export function useRedraw() {
  const [, setCount] = useState(0);
  return () => setCount((prev) => prev + 1);
}
