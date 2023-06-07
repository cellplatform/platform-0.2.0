import { Automerge } from './common';

/**
 * Helpers for converting a document field to it's proper
 * underlying Automerge type.
 */
export function fieldAs<D extends {}>(doc: D, fieldname: keyof D) {
  return {
    get textType() {
      const value = asObjectOrUndefined(doc[fieldname]);
      return value instanceof Automerge.Text ? value : undefined;
    },

    get counterType() {
      const value = asObjectOrUndefined(doc[fieldname]);
      return value instanceof Automerge.Counter ? value : undefined;
    },
  };
}

/**
 * Helpers
 */

function asObjectOrUndefined(value: any) {
  return typeof value === 'object' ? value : undefined;
}
