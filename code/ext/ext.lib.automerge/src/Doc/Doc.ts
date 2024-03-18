import { Lens } from '../Doc.Lens';
import { Namespace } from '../Doc.Namespace';
import { DocMeta as Meta } from './Doc.Meta';
import { DocPatch as Patch } from './Doc.Patch';
import { del } from './Doc.u.delete';
import { get } from './Doc.u.get';
import { getOrCreate } from './Doc.u.getOrCreate';
import { history } from './Doc.u.history';
import { A, Data, DocUri as Uri, toObject, type t } from './common';

type Uri = t.DocUri | string;

export const Doc = {
  Uri,
  Meta,
  Data,
  Patch,

  Lens,
  Namespace,
  lens: Lens.init,
  namespace: Namespace.init,

  toObject,
  get,
  getOrCreate,
  delete: del,
  splice: A.splice,
  history,
} as const;
