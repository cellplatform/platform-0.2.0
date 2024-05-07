import { isValidElement } from 'react';
import { Color, css, type t } from './common';

/**
 * Sample module loader.
 */
export function Loader(ctx: { imports: t.ModuleImports<any>; peer: t.PeerModel }) {
  return {
    async load(e: t.CmdHostLoadHandlerArgs) {
      const uri = e.uri;
      const fn = ctx.imports[uri];

      if (!uri) return null;
      if (typeof fn !== 'function') return null;

      const res = await fn();
      return isValidElement(res) ? res : null;
    },
  } as const;
}
