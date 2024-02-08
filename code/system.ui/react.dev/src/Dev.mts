import { DevBus as Bus } from './logic.Bus';
import { Spec } from './logic.Spec';
import { ValueHandler } from './logic.Tools';
import { headless } from './test.ui/headless';
import { SpecList } from './ui/List.Spec';
import { Harness } from './ui/Harness';

export const Dev = {
  Bus,
  Spec,
  SpecList,
  Harness,
  ValueHandler,
  headless,
};
