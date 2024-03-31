import type { HttpEvent } from '../types';

/**
 * @system
 */
export type { Json } from 'sys.types/src/types';

/**
 * @local
 */
export * from '../types';

/**
 * Fire an HTTP event.
 */
export type FireEvent = (e: HttpEvent) => void;
