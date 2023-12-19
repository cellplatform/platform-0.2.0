import { Info } from 'ext.lib.automerge';
import { component, module, moduleVerify } from './field.Module';

export const Field = {
  module,
  moduleVerify,
  component,
  repo: Info.Field.repo,
} as const;
