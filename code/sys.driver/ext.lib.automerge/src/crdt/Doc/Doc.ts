import { Lens } from '../Doc.Lens';
import { Namespace } from '../Doc.Namespace';
import { Text } from '../Doc.Text';
import { DocMeta as Meta } from './Doc.Meta';
import { DocPatch as Patch } from './Doc.Patch';
import { toBinary } from './Doc.u.binary';
import { del } from './Doc.u.delete';
import { ephemeral } from './Doc.u.ephemeral';
import { get } from './Doc.u.get';
import { getOrCreate } from './Doc.u.getOrCreate';
import { heads, history } from './Doc.u.history';
import { merge } from './Doc.u.merge';
import { Tag } from './Doc.u.tag';
import { Data, Is, DocUri as Uri, toObject } from './common';
import { Mutate, toHandle } from './u';
import { map } from './Doc.u.map';

export const Doc = {
  Is,
  Uri,
  Meta,
  Data,
  Patch,
  Tag,
  Text,

  Lens,
  lens: Lens.create,
  Namespace,
  ns: Namespace.create,

  get,
  getOrCreate,
  delete: del,

  toObject,
  merge,
  map,
  ensure: Mutate.ensure,

  ephemeral,
  history,
  heads,
  toHandle,
  toBinary,
} as const;
