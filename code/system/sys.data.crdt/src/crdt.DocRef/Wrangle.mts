import { Automerge, type t } from './common';

export const Wrangle = {
  automergeDoc<D extends {}>(initial: D | Uint8Array) {
    if (initial instanceof Uint8Array) {
      const [doc] = Automerge.applyChanges<D>(Automerge.init(), [initial]);
      return doc;
    } else {
      return Automerge.isAutomerge(initial) ? initial : Automerge.from<D>(initial);
    }
  },

  changeArgs<D extends {}, C extends {} = D>(args: any[]) {
    type F = t.CrdtMutator<C>;

    if (typeof args[0] === 'function') {
      const fn = args[0] as F;
      return { message: undefined, fn };
    }

    if (typeof args[0] === 'string') {
      const msg = (args[0] as string).trim();
      const message = msg || undefined;
      const fn = args[1] as F;
      return { message, fn };
    }

    throw new Error(`Could not wrangle change args.`);
  },
};
