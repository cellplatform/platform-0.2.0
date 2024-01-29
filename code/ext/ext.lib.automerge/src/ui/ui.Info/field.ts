import { document } from './field.Document';
import { component, module, moduleVerify } from './field.Module';
import { repo } from './field.Repo';

export const InfoField = {
  module,
  moduleVerify,
  component,
  repo,
  document,
} as const;
