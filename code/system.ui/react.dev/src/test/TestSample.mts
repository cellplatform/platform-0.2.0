import { t, rx, slug } from '../common';
import { DevBus } from '../logic.Bus';
import { SAMPLES } from '../test.sample/specs.unit-test';
import { Context } from '../logic.Ctx';

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
  async context() {
    const { instance, events } = await TestSample.create();
    const context = await Context.init(instance);
    const ctx = context.ctx;
    context.dispose$.subscribe(() => events.dispose());
    const dispose = () => context.dispose();
    return { context, ctx, instance, events, dispose };
  },
};
