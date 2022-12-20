import { rx, slug } from '../common';
import { DevBus } from '../logic.Bus';
import { SAMPLES } from '../test.sample/specs.unit-test';

export const TestSample = {
  instance: () => ({ bus: rx.bus(), id: `foo.${slug()}` }),
  async create() {
    const instance = TestSample.instance();
    const events = DevBus.Controller({ instance });
    return { events, instance };
  },
  async preloaded() {
    const { events, instance } = await TestSample.create();
    await events.load.fire(SAMPLES.Sample1);
    return { events, instance };
  },
};
