import { Mutate } from './State.Mutate.mjs';
import { init } from './State.init.mjs';

/**
 * Tools for working with the WebRTC shared network state.
 */
export const WebRtcState = {
  Mutate,
  init,
} as const;
