import type { t } from './common.mjs';

export type * from './types.event.mjs';
export type * from './types.hooks.mjs';
export type * from './types.state.mjs';

export type VimeoId = number; // Vimeo video identifier.
export type VimeoIconFlag = 'spinner' | 'play' | 'pause' | 'replay';
export type VimeoInstance = { bus: t.EventBus<any>; id: string };
