import { cuid } from './common';

export const identity = {
  randomPeerId() {
    return `p${cuid()}`;
  },

  asId(input: string) {
    input = (input || '').trim();
    input = input.replace(/^peer\:/, '');
    return input.trim();
  },

  asUri(id: string) {
    return `peer:${identity.asId(id)}`;
  },
};
