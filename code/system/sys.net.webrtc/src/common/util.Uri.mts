import type * as t from './types.mjs';
import { StringUtil } from './util.String.mjs';

/**
 * Network URIs.
 */
export const UriUtil = {
  /**
   * A URI that represents a unique peer.
   */
  peer: {
    create(id: t.PeerId) {
      return `peer:${id.trim()}`;
    },

    parse(input: any, options: { throw?: boolean } = {}): t.PeerUriObject | undefined {
      const value = toString(input);

      const throwError = (errors: string[] = []) => {
        let msg = 'Peer URI could not be parsed';
        if (errors.length > 0) msg = `${msg}\n${errors.join('\n')}`;
        throw new Error(msg);
      };

      if (!value.startsWith('peer:')) {
        if (options.throw) throwError();
        return;
      }

      const parts = value.split(':').map((part) => part.trim());
      const peer = parts[1] || '';
      const uri: t.PeerUriObject = { ok: true, type: 'peer', peer, errors: [] };

      const error = (message: string) => uri.errors.push(message);
      if (!uri.peer) error(`No peer identifier`);

      uri.ok = uri.errors.length === 0;
      if (!uri.ok && options.throw) {
        throwError(uri.errors);
      }

      return uri;
    },

    trimPrefix(input: any) {
      return typeof input === 'string' ? input.trim().replace(/^peer\:/, '') : '';
    },
  },

  /**
   * A URI that represents a peer connection.
   */
  connection: {
    create(kind: t.PeerConnectionKind, peer: t.PeerId, id: string) {
      const type = kind.trim().replace(/\//g, '.');
      return `conn:${type}:${peer.trim()}.${StringUtil.formatConnectionId(id)}`;
    },

    parse(input: any, options: { throw?: boolean } = {}): t.PeerUriConnectionObject | undefined {
      const value = toString(input);

      const throwError = (errors: string[] = []) => {
        let msg = 'Connection URI could not be parsed';
        if (errors.length > 0) msg = `${msg}\n${errors.join('\n')}`;
        throw new Error(msg);
      };

      if (!value.startsWith('conn:')) {
        if (options.throw) throwError();
        return;
      }

      const parts = value.split(':').map((part) => part.trim());
      const kind = (parts[1] || '').replace(/\./g, '/') as t.PeerConnectionKind;
      const id = (parts[2] || '').split('.');
      const peer = (id[0] || '') as t.PeerId;
      const connection = (id[1] || '') as t.PeerConnectionId;

      const uri: t.PeerUriConnectionObject = {
        ok: true,
        type: 'connection',
        kind,
        peer,
        connection,
        errors: [],
      };

      const error = (message: string) => uri.errors.push(message);
      const kinds: t.PeerConnectionKind[] = ['data', 'media/screen', 'media/video'];
      if (!kinds.includes(uri.kind)) error(`Connection kind not supported`);
      if (!uri.peer) error(`No peer identifier`);
      if (!uri.connection) error(`No connection identifier`);

      uri.ok = uri.errors.length === 0;
      if (!uri.ok && options.throw) throwError(uri.errors);

      return uri;
    },
  },

  is: {
    peer: (input: any) => toString(input).startsWith('peer:'),
    connection: (input: any) => toString(input).startsWith('conn:'),
  },
};

/**
 * [Helpers]
 */
function toString(input: any) {
  return (typeof input === 'string' ? input : '').trim();
}
