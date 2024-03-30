import { PropList } from './common';
import { doc } from './field.Document';
import { head } from './field.Head';
import { history } from './field.History';
import { component, module, moduleVerify } from './field.Module';
import { repo } from './field.Repo';

const { visible } = PropList.InfoPanel.Fields;

export const Field = {
  module,
  moduleVerify,
  component,
  repo,
  doc,
  history,
  head,
  visible,
} as const;
