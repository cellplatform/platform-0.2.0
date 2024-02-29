import { auth } from './field.Auth';
import { module, moduleVerify } from './field.Module';
import { listProjects } from './field.Projects';

export const Field = {
  module,
  moduleVerify,
  listProjects,
  auth,
} as const;
