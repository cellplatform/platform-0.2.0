import { component, module, moduleVerify } from './field.Module';
import { peer } from './field.Peer';

export const Field = {
  module,
  moduleVerify,
  component,
  peer,
} as const;
