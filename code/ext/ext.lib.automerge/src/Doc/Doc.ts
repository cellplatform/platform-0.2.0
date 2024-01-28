import { Lens } from '../Doc.Lens';
import { Lens as Lens2 } from '../Doc.Lens.NEXT';
import { Namespace } from '../Doc.Namespace';
import { DocMeta as Meta } from './Doc.Meta';
import { DocPatch as Patch } from './Doc.Patch';
import { del } from './Doc.u.delete';
import { get, getOrCreate } from './Doc.u.get';
import { Data, DocUri as Uri, toObject, type t } from './common';

type Uri = t.DocUri | string;

export const Doc = {
  Uri,
  Meta,
  Data,
  Patch,
  Lens,
  Lens2, // TEMP 🐷
  Namespace,

  lens: Lens.init,
  lens2: Lens2.init, // TEMP 🐷
  namespace: Namespace.init,

  toObject,
  get,
  getOrCreate,
  delete: del,
} as const;
