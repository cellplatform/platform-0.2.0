/**
 * @external
 */
import { uniq, equals, uniqBy, groupBy } from 'ramda';
export const R = { uniq, equals, uniqBy, groupBy };

import * as PeerJS from './libs.peerjs.mjs';
export { PeerJS };

/**
 * @system
 */
export { rx, slug, cuid, Time, Is, Delete } from 'sys.util';
