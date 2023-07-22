/**
 * @external
 */
import { clone, uniq } from 'ramda';
export const R = { clone, uniq } as const;
export { Subject } from 'rxjs';

/**
 * @system
 */
export { Time, Path, slug, rx } from 'sys.util';
