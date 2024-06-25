import { PropList } from './common';
import { component, module, moduleVerify } from './field.Module';
import { network } from './field.Network';
import { peer } from './field.Peer';
import { repo } from './field.Repo';

const { visible } = PropList.Info.Fields;

export const Field = {
  module,
  moduleVerify,
  component,
  peer,
  network,
  repo,
  visible,
} as const;
