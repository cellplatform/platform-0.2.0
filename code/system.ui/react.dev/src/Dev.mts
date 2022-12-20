import { Spec } from './Spec';
import { Harness } from './ui/Harness';
import { Entry } from './ui/Entry';
import { DevBus as Bus } from './logic.Bus';

const { render } = Entry;

export const Dev = {
  Bus,
  Spec,
  Harness,
  render,
};
