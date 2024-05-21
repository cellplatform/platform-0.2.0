import { isValidElement } from 'react';
import { type t } from './common';

/**
 * Sample module loader.
 */
export function createLoader(imports: t.ModuleImports<any>) {
  return {
    async load(e: t.CmdHostLoadHandlerArgs) {
      const uri = e.uri;
      const fn = imports[uri];

      if (!uri) return null;
      if (typeof fn !== 'function') return null;

      const res = await fn();
      return isValidElement(res) ? res : null;
    },
  } as const;
}
