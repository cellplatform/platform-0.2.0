/**
 * @external
 */
import { clamp, clone, uniq, equals, uniqBy, groupBy } from 'ramda';
export const R = { clamp, clone, uniq, equals, uniqBy, groupBy } as const;

export { Peer as PeerJS } from 'peerjs';

/**
 * @system
 */
export { rx, slug, cuid, Time, Is, Delete, Path, Value } from 'sys.util';
export { MediaStream } from 'sys.ui.react.media';
export { Filesystem, Filesize } from 'sys.fs.indexeddb';
export { Crdt, Automerge, toObject } from 'sys.data.crdt';
export { UserAgent } from 'sys.ui.dom';
