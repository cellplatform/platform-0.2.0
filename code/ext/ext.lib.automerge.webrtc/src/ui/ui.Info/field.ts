import { InfoField } from 'ext.lib.automerge';
import { component, module, moduleVerify } from './field.Module';

export const Field = {
  module,
  moduleVerify,
  component,
  get repo() {
    return InfoField.repo;
  },
} as const;
