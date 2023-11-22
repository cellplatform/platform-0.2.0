import { equals } from 'ramda';
export const R = { equals } as const;
export { next as A } from '@automerge/automerge';

/**
 * @ext
 */
export { WebStore } from 'ext.lib.automerge';
export { Webrtc } from 'ext.lib.peerjs';

/**
 * @system
 */
export { Filesize, Time, cuid, rx } from 'sys.util';
