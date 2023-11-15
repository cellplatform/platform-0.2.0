import { fieldModuleVerify as moduleVerify } from './field.Module.Verify';
import { fieldRepo as repo } from './field.Repo';

export const Field = {
  moduleVerify,
  repo,
} as const;
