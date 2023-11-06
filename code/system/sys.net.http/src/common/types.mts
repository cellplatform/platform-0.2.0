import type { HttpEvent } from '../types.mjs';

/**
 * @system
 */
export type { Json } from 'sys.types/src/types';

/**
 * @local
 */
export * from '../types.mjs';

/**
 * Fire an HTTP event.
 */
export type FireEvent = (e: HttpEvent) => void;
