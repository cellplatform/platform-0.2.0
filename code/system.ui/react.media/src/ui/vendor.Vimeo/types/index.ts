import type { t } from '../common';

export type * from './types.events.mjs';
export type * from './types.state.mjs';
export type * from './types.ui.mjs';

export type VimeoId = number; // Vimeo video identifier.
export type VimeoIconFlag = 'spinner' | 'play' | 'pause' | 'replay';
export type VimeoInstance = { bus: t.EventBus<any>; id: string };
