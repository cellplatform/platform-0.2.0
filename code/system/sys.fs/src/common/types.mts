/**
 * @system
 */
import { Json as SysJson, EventBus as SysEventBus } from 'sys.types';
export type Json = SysJson;
export type EventBus = SysEventBus;

/**
 * @local
 */
export * from '../types/index.mjs';
