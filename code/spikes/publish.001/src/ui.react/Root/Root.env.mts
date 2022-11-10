import { rx, State, t } from '../common';
import { KeyboardMonitor } from './Root.env.keyboard.mjs';

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

KeyboardMonitor.listen(controller);

/**
 * Environment.
 */
export const env = {
  instance,
  controller,
};
