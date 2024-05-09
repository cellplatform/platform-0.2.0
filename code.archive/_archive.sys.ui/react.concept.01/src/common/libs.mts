/**
 * @external
 */
import { equals } from 'ramda';
export const R = { equals } as const;

/**
 * @system
 */
export { Crdt, CrdtViews } from 'sys.data.crdt';
export { Filesize, Path } from 'sys.fs';
export { Percent, rx, slug, cuid, Time, Delete } from 'sys.util';
export { Text } from 'sys.text';
