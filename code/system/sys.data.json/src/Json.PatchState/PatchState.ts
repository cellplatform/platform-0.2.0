import { Command } from './Command';
import { Is } from './PatchState.Is';
import { init } from './PatchState.init';
import { toObject } from './common';

/**
 * Simple safe/immutable memory state for a single item.
 */
export const PatchState = {
  init,
  Is,
  Command,
  toObject,
} as const;
