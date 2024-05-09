import { init as Lens } from '../crdt.Lens/Lens.impl.mjs';
import { type t } from './common';

export const Wrangle = {
  container<R extends {}, N extends string = string>(root: R, getMap?: t.CrdtNsMapGetLens<R>) {
    return (getMap ? getMap(root) : root) as t.CrdtNsMap<N>;
  },

  containerLens<R extends {}, N extends string = string>(
    root: t.CrdtDocRef<R>,
    getMap?: t.CrdtNsMapGetLens<R>,
    dispose$?: t.Observable<any>,
  ) {
    return Lens<R, t.CrdtNsMap<N>>(
      root,
      (draft) => Wrangle.container<R, N>(draft, getMap),
      { dispose$ },
      //
    );
  },
};
