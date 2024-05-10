import { FsBusIoEvent } from './types.events.io.mjs';
import { FsBusIndexEvent } from './types.events.indexer.mjs';
import { FsBusChangedEvent } from './types.events.change.mjs';
import { FsBusInfoReqEvent, FsBusInfoResEvent } from './types.events.info.mjs';

/**
 * EVENTS
 */
export type FsBusEvent =
  | FsBusIoEvent
  | FsBusIndexEvent
  | FsBusInfoReqEvent
  | FsBusInfoResEvent
  | FsBusChangedEvent;
