import React, { useEffect } from 'react';

import { rx, State, t } from '../common.mjs';

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
const instance: t.StateInstance = { bus: rx.bus() };
const controller = State.Bus.Controller({ instance });

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
