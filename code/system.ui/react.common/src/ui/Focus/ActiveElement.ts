import { type t } from '../common';
import { Wrangle } from './Wrangle';

const handlers = new Set<t.ActiveElementChangedHandler>();
let initialized = false;

/**
 * Singleton helper for monitoring the documents current
 * focused element (aka the "ActiveElement").
 */
export const ActiveElement = {
  get listenerTotal() {
    return handlers.size;
  },

  listen(handler: t.ActiveElementChangedHandler) {
    handlers.add(handler);

    if (!initialized) {
      const onChange = (focus: boolean) => {
        return (e: FocusEvent) => {
          const el = document.activeElement || undefined;
          handlers.forEach((fn) => fn(Wrangle.args(focus, el)));
        };
      };

      // NB: Window event only ever added once.
      window.addEventListener('focusin', onChange(true));
      window.addEventListener('focusout', onChange(false));
    }

    initialized = true;
    return {
      dispose() {
        handlers.delete(handler);
      },
    };
  },
};
