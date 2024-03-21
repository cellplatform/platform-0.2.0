import { doc } from './field.Document';
import { component, module, moduleVerify } from './field.Module';
import { repo } from './field.Repo';
import { history } from './field.History';
import { head } from './field.Head';

export const InfoField = {
  module,
  moduleVerify,
  component,
  repo,
  doc,
  history,
  head,
} as const;
