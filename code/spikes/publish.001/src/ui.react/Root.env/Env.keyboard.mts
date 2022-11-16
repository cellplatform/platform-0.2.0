import { State, t } from '../common';
import { EnvLog } from './Env.log.mjs';

export const KeyboardMonitor = {
  listen(state: t.StateEvents) {
    const handler = async (e: KeyboardEvent) => {
      const handled = () => e.preventDefault();

      // CMD+S:
      if (e.key === 's' && e.metaKey) {
        handled(); // Cancel "save" HTML page (default browser action).
      }

      // CMD+K:
      if (e.key === 'k' && e.metaKey) {
        console.clear();
      }

      // CMD+P:
      if (e.key === 'p' && e.metaKey) {
        handled(); // Cancel "print" HTML page action (browser default).
        await EnvLog.current(state); // Print current state to console.
      }

      // CMD+M: (Mute/Unmute)
      if (e.key === 'm') {
        if (!State.Is.inputSelected) await State.Change.toggleMute(state);
      }
    };

    /**
     * Lifecycle.
     */
    document.addEventListener('keydown', handler);
    return {
      dispose: () => document.removeEventListener('keydown', handler),
    };
  },
};
