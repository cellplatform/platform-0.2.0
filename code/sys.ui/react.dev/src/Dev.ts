import { DevBus as Bus } from './fn.Bus';
import { Context } from './fn.Ctx';
import { Spec } from './fn.Spec';
import { ValueHandler } from './fn.Tools';
import { headless } from './test.ui/headless';
import { Harness } from './ui/Harness';
import { ModuleList } from './ui/ModuleList';

export const Dev = {
  Context,
  Bus,
  Spec,
  ModuleList,
  Harness,
  ValueHandler,
  headless,
} as const;
