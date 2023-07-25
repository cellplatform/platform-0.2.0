/**
 * @external
 */
import { clone, uniq, flatten } from 'ramda';
export const R = { clone, uniq, flatten } as const;

/**
 * @system
 */
export { Mime, Delete, Hash, Is, Stream, Json, Sort, Time } from 'sys.util';
export { asArray, cuid, slug, rx } from 'sys.util';
