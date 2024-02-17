import { component, module, moduleVerify } from './field.Module';
import { listProjects } from './field.Projects';

export const Field = {
  module,
  moduleVerify,
  component,
  listProjects,
} as const;
