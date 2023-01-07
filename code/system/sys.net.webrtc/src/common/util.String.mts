import * as t from './types.mjs';

/**
 * String helpers.
 */
export const StringUtil = {
  formatConnectionId(id: string) {
    return (id || '').trim().replace(/^dc_/, '').replace(/^mc_/, '');
  },

  parseEndpointAddress(args: { address: string; key: string }): t.PeerSignallingEndpoint {
    const address = StringUtil.stripHttp((args.address || '').trim());
    const key = args.key ?? '';
    const parts = address.trim().split('/');
    const path = StringUtil.stripPathLeft(parts[1]) || '/';
    const hostParts = (parts[0] || '').split(':');

    const host = hostParts[0];
    const secure = !host.startsWith('localhost');
    const port = hostParts[1] ? parseInt(hostParts[1], 10) : secure ? 443 : 80;

    const base = `http${secure ? 's' : ''}://${host}:${port}${path}`;
    const url = {
      base,
      peers: `${base.replace(/\/$/, '')}/conn/peers`,
    };

    return { key, host, port, path, secure, url };
  },

  stripHttp(text?: string) {
    return (text || '')
      .trim()
      .replace(/^http\:\/\//, '')
      .replace(/^https\:\/\//, '');
  },

  stripPathLeft(text?: string) {
    return (text || '').trim().replace(/^\/*/, '').trim();
  },

  truncate(value: string, options: { edge?: number; divider?: string } = {}) {
    const { divider = '...' } = options;
    const edge = options.edge ?? 8;
    const left = value.substring(0, edge);
    const right = value.substring(value.length - edge);
    return `${left}${divider}${right}`;
  },
};
