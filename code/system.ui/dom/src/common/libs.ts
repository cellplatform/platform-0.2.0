/**
 * @external
 */
import { clone, uniq } from 'ramda';
export const R = { clone, uniq } as const;
export { Subject } from 'rxjs';

/**
 * @system
 */
export { Filesize, Path, Time, rx, slug } from 'sys.util';
