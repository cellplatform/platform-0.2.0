import { rx, slug } from '../common';
import { DevBus } from '../logic.Bus';
import { Context } from '../logic.Ctx';
import { SAMPLES } from '../test.ui/sample.specs.unit';

/**
 * Sample test factories.
 */
export const TestSample = {
  instance: () => ({ bus: rx.bus(), id: `foo.${slug()}` }),

  async controller() {
    const instance = TestSample.instance();
    const events = DevBus.Controller({ instance });
    return { events, instance };
  },

  async preloaded() {
    const { events, instance } = await TestSample.controller();
    await events.load.fire(SAMPLES.Sample1);
    return { events, instance };
  },

  async context() {
    const { instance, events } = await TestSample.controller();
    const context = await Context.init(instance);
    const ctx = context.ctx;
    context.dispose$.subscribe(() => events.dispose());
    const dispose = () => context.dispose();
    return { context, ctx, instance, events, dispose };
  },
};
