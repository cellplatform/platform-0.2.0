import { useEffect } from 'react';
import { Keyboard } from '../common';

export function useKeyboard() {
  useEffect(() => {
    Keyboard.on({
      /**
       * ENTER Key: Default entry redirect to the "dev" view.
       */
      Enter() {
        const url = new URL(window.location.href);
        url.searchParams.set('dev', 'true');
        window.location.href = url.href;
      },
    });
  }, []);
}
