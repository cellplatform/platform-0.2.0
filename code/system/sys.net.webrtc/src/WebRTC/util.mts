import { t } from './common';

export const Util = {
  toId(input: string) {
    input = (input || '').trim();
    input = input.replace(/^peer\:/, '');
    return input;
  },

  toUri(input: string) {
    return `peer:${Util.toId(input)}`;
  },

  is: {
    dataPayload(input: any) {
      if (typeof input !== 'object') return false;

      const data = input as t.PeerDataPayload;

      if (typeof data.source !== 'object') return false;
      if (typeof data.source.peer !== 'string') return false;
      if (typeof data.source.connection !== 'string') return false;
      if (typeof data.event !== 'object') return false;
      if (typeof data.event.type !== 'string') return false;
      if (typeof data.event.payload !== 'object') return false;

      return true;
    },
  },
};
