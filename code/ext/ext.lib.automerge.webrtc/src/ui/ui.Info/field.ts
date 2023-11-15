import { Info as AutomergeInfo } from 'ext.lib.automerge';
import { component, module, moduleVerify } from './field.Module';

export const Field = {
  module,
  moduleVerify,
  component,
  repo: AutomergeInfo.Field.repo,
} as const;
