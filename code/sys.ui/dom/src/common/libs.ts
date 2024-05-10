/**
 * @external
 */
export { Subject } from 'rxjs';

import { clone, uniq } from 'ramda';
export const R = { clone, uniq } as const;

/**
 * @system
 */
export { Filesize, Path, Time, rx, slug } from 'sys.util';
