import { InfoField } from 'ext.lib.automerge';
import { component, module, moduleVerify } from './field.Module';
import { peer } from './field.Peer';
import { network } from './field.Network';

export const Field = {
  module,
  moduleVerify,
  component,
  peer,
  network,
  get repo() {
    return InfoField.repo;
  },
} as const;
