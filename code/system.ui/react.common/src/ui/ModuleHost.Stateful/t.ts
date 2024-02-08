import type { t } from './common';

export type ModuleHostStatefulProps<T = t.SpecModule> = t.ModuleHostProps<T> & {
  mutateUrl?: boolean;
};
