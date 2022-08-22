import { SysFsIoEvent } from './types.events.io.mjs';
import { SysFsIndexEvent } from './types.events.indexer.mjs';
import { SysFsCellEvent } from './types.events.cell.mjs';
import { SysFsChangedEvent } from './types.events.change.mjs';
import { SysFsInfoReqEvent, SysFsInfoResEvent } from './types.events.info.mjs';
/**
 * EVENTS
 */
export declare type SysFsEvent = SysFsIoEvent | SysFsIndexEvent | SysFsCellEvent | SysFsInfoReqEvent | SysFsInfoResEvent | SysFsChangedEvent;
