import { DocLens as Lens } from '../Doc.Lens';
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

  toObject,
  get,
  getOrCreate,
  delete: del,
} as const;
