import { KeyListener, State, t } from '../common';
import { EnvLog } from './Env.log.mjs';

export const KeyboardMonitor = {
  listen(state: t.StateEvents) {
    return KeyListener.keydown(async (e) => {
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
    });
  },
};
