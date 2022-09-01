import { SysFsIoEvent } from './types.events.io.mjs';
import { SysFsIndexEvent } from './types.events.indexer.mjs';
import { SysFsChangedEvent } from './types.events.change.mjs';
import { SysFsInfoReqEvent, SysFsInfoResEvent } from './types.events.info.mjs';

/**
 * EVENTS
 */
export type SysFsEvent =
  | SysFsIoEvent
  | SysFsIndexEvent
  | SysFsInfoReqEvent
  | SysFsInfoResEvent
  | SysFsChangedEvent;
