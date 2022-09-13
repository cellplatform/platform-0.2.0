import type { HttpEvent } from '../types.mjs';

export * from '../types.mjs';
export type { Json } from 'sys.types';

/**
 * Fire an HTTP event.
 */
export type FireEvent = (e: HttpEvent) => void;
