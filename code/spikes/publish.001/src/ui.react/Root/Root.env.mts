import { rx, State, t, BundlePaths, Pkg } from '../common';

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
    // Cancel "save" HTML page action (browser default).
    e.preventDefault();
  }

  // CMD+P
  if (e.key === 'p' && e.metaKey) {
    // Cancel "print" HTML page action (browser default).
    e.preventDefault();

    /**
     * PRINT info.
     */
    const { info } = await controller.info.get();
    console.info('');
    console.group('💦'.repeat(20));
    console.info('[CMD+P]');
    console.info('Package:', Pkg);
    console.info('BundlePaths:', BundlePaths);
    console.info('Current State:', info?.current);
    console.info('');

    console.log('selection', info?.current.selection);

    console.groupEnd();
    console.info('');
  }
});

/**
 * Environment.
 */
export const env = {
  instance,
  controller,
};
