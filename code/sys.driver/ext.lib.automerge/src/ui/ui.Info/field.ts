import { PropList } from './common';
import { document } from './field.Doc';
import { component, module, moduleVerify } from './field.Module';
import { repo } from './field.Repo';

const { visible } = PropList.Info.Fields;

export const Field = {
  module,
  moduleVerify,
  component,
  repo,
  document,
  visible,
} as const;
