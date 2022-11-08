import { rx, State, t } from '../common';

const isTauri = typeof (window as any).__TAURI__ === 'object';
const url = new URL(window.location.href);

if (isTauri) {
  url.searchParams.set('show', 'outline|doc,editor');
}

/**
 * TODO 🐷
 * - Put state/controller management somewhere sensible.
 */

/**
 * 💦💦
 *
 *    State: Initialize controller.
 *
 * 💦
 */
const bus = rx.bus();
const instance: t.StateInstance = { bus };
const controller = State.Bus.Controller({ instance, initial: { location: url.href } });

/**
 * Keyboard events
 */
document.addEventListener('keydown', async (e) => {
  // CMD+S:
  if (e.key === 's' && e.metaKey) {
    // Cancel browser "save" HTML page save.
    e.preventDefault();

    // Debug (log state):
    const { info } = await controller.info.get();
    console.info('[CMD+S] state:', info?.current);
  }
});

/**
 * Environment.
 */
export const env = {
  instance,
  controller,
};
