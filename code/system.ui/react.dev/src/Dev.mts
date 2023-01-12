import { Spec } from './logic.Spec';
import { Harness } from './ui/Harness';
import { Entry } from './ui/Entry';
import { DevBus as Bus } from './logic.Bus';
import { ValueHandler } from './logic.Tools';

export const Dev = {
  Bus,
  Spec,
  Harness,
  ValueHandler,
  render: Entry.render,
};
