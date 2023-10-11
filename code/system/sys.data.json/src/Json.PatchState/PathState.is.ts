import { type t } from './common';
import { Patch } from '../Json.Patch';

export const is = {
  state(input: any): input is t.PatchState<any> {
    if (input === null || typeof input !== 'object') return false;
    if (typeof input.instance !== 'string') return false;
    if (typeof input.change !== 'function') return false;
    if (typeof input.events !== 'function') return false;
    const descriptor = Object.getOwnPropertyDescriptor(input, 'current');
    return !!descriptor && typeof descriptor.get === 'function';
  },

  proxy(input: any) {
    return Patch.isProxy(input);
  },
} as const;
