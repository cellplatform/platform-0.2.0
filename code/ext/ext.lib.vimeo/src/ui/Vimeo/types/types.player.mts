import { type t } from '../common';

/**
 * API from the player hook.
 * Vimeo.usePlayer(...)
 */
export type VimeoPlayer = {
  readonly ready: boolean;
  readonly events?: t.VimeoEvents;
  readonly status?: t.VimeoStatus;
  readonly playing: boolean;
  play(): void;
  pause(): void;
  toggle(): void;
  seek(seconds: number): void;
};

/**
 * Events
 */
export type VimeoPlayerHandler = (e: VimeoPlayerHandlerArgs) => void;
export type VimeoPlayerHandlerArgs = {
  status: t.VimeoStatus;
};
