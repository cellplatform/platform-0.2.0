import { component, module, moduleVerify } from './field.Module';
import { network } from './field.Network';
import { peer } from './field.Peer';
import { repo } from './field.Repo';

export const Field = {
  module,
  moduleVerify,
  component,
  peer,
  network,
  repo,
} as const;
