export { Monaco } from 'ext.lib.monaco.crdt';
export { Yaml };

import Yaml from 'yaml';

/**
 * @ext
 */
export {
  Crdt,
  Info as CrdtInfo,
  Doc,
  RepoList,
  WebStore,
  toObject,
  DocUri,
  useDoc,
} from 'ext.lib.automerge';
export { PeerRepoList, WebrtcStore } from 'ext.lib.automerge.webrtc';
export { Peer, PeerUI } from 'ext.lib.peerjs';
export { DenoHttp } from 'ext.lib.deno';

import { Doc } from 'ext.lib.automerge';

/**
 * @sys
 */
export { Cmd } from 'sys.cmd';
export { Immutable } from 'sys.util';

export { CmdBar } from 'sys.ui.react.common';

/**
 * @local
 */
export * from '../common';
export type * as t from './common.t';

/**
 * Constants.
 */
export const DEFAULTS = {} as const;

/**
 * Helpers
 */
export const Wrangle = {
  dataPath(docuri?: string) {
    const root = ['ns'];
    if (!docuri) return root;
    return [...root, `editor.${docuri.slice(-6)}`];
  },

  docUri: {
    fromId(id: string) {
      id = Wrangle.docUri.toId(id);
      return `crdt:a.${id}`;
    },

    toId(text: string) {
      let id = Doc.Uri.id(text);
      id = id.replace(/^automerge\:/, '');
      id = id.replace(/^crdt\:/, '');
      id = id.replace(/^a\./, '');
      id = id.split('@')[0];
      return id;
    },
  },
} as const;
