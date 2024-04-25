import { Lens } from '../Doc.Lens';
import { Namespace } from '../Doc.Namespace';
import { DocMeta as Meta } from './Doc.Meta';
import { DocPatch as Patch } from './Doc.Patch';
import { del } from './Doc.u.delete';
import { get } from './Doc.u.get';
import { getOrCreate } from './Doc.u.getOrCreate';
import { heads, history } from './Doc.u.history';
import { splice } from './Doc.u.splice';
import { Tag } from './Doc.u.tag';
import { Data, Is, DocUri as Uri, toObject, type t } from './common';
import { toHandle } from './u';

type Uri = t.DocUri | t.UriString;

export const Doc = {
  Is,
  Uri,
  Meta,
  Data,
  Patch,
  Tag,

  Lens,
  Namespace,
  lens: Lens.init,
  namespace: Namespace.init,

  toObject,
  get,
  getOrCreate,
  delete: del,
  splice,

  history,
  heads,
  toHandle,
} as const;
