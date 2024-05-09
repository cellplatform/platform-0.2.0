import { CrdtLens, DEFAULTS, FC, type t } from './common';
import { View } from './ui';

const ns = CrdtLens.namespace;

type Fields = {
  DEFAULTS: typeof DEFAULTS;
  ns: typeof CrdtLens.namespace;
};
export const CrdtNamespace = FC.decorate<t.CrdtNsProps, Fields>(
  View,
  { DEFAULTS, ns },
  { displayName: 'Crdt.Namespace' },
);
