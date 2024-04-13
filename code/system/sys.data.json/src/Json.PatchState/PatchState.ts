import { Command } from './Command';
import { Is } from './PatchState.Is';
import { create } from './PatchState.impl';
import { toObject } from './common';

/**
 * Simple safe/immutable memory state for a single item.
 */
export const PatchState = {
  create,
  toObject,
  Is,
  Command,
} as const;
