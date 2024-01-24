/**
 * @external
 */

// @ts-ignore
import * as glamor from 'glamor-jss';
export { glamor };

import { isEmpty } from 'ramda';
export const R = { isEmpty } as const;

/**
 * @system
 */
export { Id, Is, Value, rx } from 'sys.util';
