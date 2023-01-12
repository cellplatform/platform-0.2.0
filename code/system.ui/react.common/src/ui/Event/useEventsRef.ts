import { useEffect, useRef } from 'react';

import { t } from '../common';

/**
 * Lifecycle manager for managing an [Events] API within a react component
 * disposing of the [Events] object when the component unmounts.
 */
export function useEventsRef<Events extends t.Disposable>(factory: () => Events) {
  const eventsRef = useRef<Events>(factory());

  useEffect(() => {
    const events = eventsRef.current;
    return () => events?.dispose?.();
  }, []);

  return eventsRef.current;
}
