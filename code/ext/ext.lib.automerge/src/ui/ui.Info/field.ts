import { component, module, moduleVerify } from './field.Module';
import { repo } from './field.Repo';

export const Field = {
  module,
  moduleVerify,
  component,
  repo,
} as const;
