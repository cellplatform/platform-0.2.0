import { Automerge } from './libs.mjs';

export const Is = {
  automergeObject(input: any) {
    return typeof Automerge.getObjectId(input) === 'string';
  },
};
