import { component, module, moduleVerify } from './field.Module';
import { network } from './field.Network';
import { peer } from './field.Peer';
import { repo } from './field.Repo';
import { visible } from './field.Visible';

export const Field = {
  module,
  moduleVerify,
  component,
  peer,
  network,
  repo,
  visible,
} as const;
