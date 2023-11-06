import { Patch } from '../Json.Patch';
import { type t } from './common';

export const Is = {
  /**
   * Determine if the given object is a [PatchState] object.
   */
  state(input: any): input is t.PatchState<any> {
    if (input === null || typeof input !== 'object') return false;
    if (typeof input.instance !== 'string') return false;
    if (typeof input.change !== 'function') return false;
    if (typeof input.events !== 'function') return false;
    const descriptor = Object.getOwnPropertyDescriptor(input, 'current');
    return !!descriptor && typeof descriptor.get === 'function';
  },

  /**
   * Determine if the given object is a [PatchState] of the specified type.
   */
  type(input: any, type: string): input is t.PatchState<any> {
    if (!Is.state(input)) return false;
    return input.type === type;
  },

  /**
   * Determine if the given object is a "proxy/draft" that is
   * currently being edited within a change function.
   */
  proxy(input: any) {
    return Patch.isProxy(input);
  },
} as const;
