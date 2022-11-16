import { t } from './common.mjs';

export * from './types.event.mjs';
export * from './types.hooks.mjs';
export * from './types.state.mjs';

export type VimeoId = number; // Vimeo video identifier.
export type VimeoIconFlag = 'spinner' | 'play' | 'pause' | 'replay';
export type VimeoInstance = { bus: t.EventBus<any>; id: string };
