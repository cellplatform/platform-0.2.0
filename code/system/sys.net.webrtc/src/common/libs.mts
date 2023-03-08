/**
 * @external
 */
import { uniq, equals, uniqBy, groupBy } from 'ramda';
export const R = { uniq, equals, uniqBy, groupBy };

export { Peer as PeerJS } from 'peerjs';

/**
 * @system
 */
export { rx, slug, cuid, Time, Is, Delete, Path } from 'sys.util';
export { MediaStream } from 'sys.ui.react.media';
export { Filesystem, Filesize } from 'sys.fs.indexeddb';
export { Crdt, Automerge } from 'sys.data.crdt';
