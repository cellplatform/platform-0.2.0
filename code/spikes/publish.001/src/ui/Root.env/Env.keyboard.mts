import { KeyListener, State, t } from '../common';
import { EnvLog } from './Env.log.mjs';

export const KeyboardMonitor = {
  listen(state: t.StateEvents) {
    return KeyListener.keydown(async (e) => {
      const handled = () => e.preventDefault();
      const getInfo = async () => (await state.info.get()).info?.current;

      // CMD+S:
      if (e.key === 's' && e.metaKey) {
        // ACTION: Cancel "save" HTML page (default browser action).
        handled();
      }

      // CMD+K:
      if (e.key === 'k' && e.metaKey) {
        // ACTION: Clear "developer-tools" console.
        console.clear();
      }

      // CMD+P:
      if (e.key === 'p' && e.metaKey) {
        // ACTION: Cancel "print" HTML page action (browser default).
        //       : Log state to console.
        handled();
        await EnvLog.current(state);
      }

      // CMD+M: (Mute/Unmute)
      if (e.key === 'm') {
        // ACTION: Toggle global mute status.
        if (!State.Is.inputSelected) await State.Change.toggleMute(state);
      }

      // CMD+<ArrowKey>:
      if (e.key === 'ArrowLeft' || (e.key === 'ArrowRight' && e.metaKey)) {
        // ACTION: Suppress browser action - Forward/Back buttons
        handled();
      }

      // CMD+<Escape>
      if (e.key === 'Escape') {
        // ACTION: Hide overlay.
        const current = await getInfo();
        if (current) {
          if (Boolean(current.overlay)) state.overlay.close();
        }
      }
    });
  },
};
