import { rx, slug } from '../common';
import { DevBus } from '../f.Bus';
import { Context } from '../f.Ctx';
import { SAMPLES } from '../test.ui/sample.specs.unit-test';

/**
 * Sample test factories.
 */
export const TestSample = {
  instance: () => ({ bus: rx.bus(), id: `foo.${slug()}` }),

  async controller() {
    const instance = TestSample.instance();
    const events = DevBus.Controller({ instance });
    return { events, instance } as const;
  },

  async preloaded() {
    const { events, instance } = await TestSample.controller();
    await events.load.fire(SAMPLES.Sample1);
    return { events, instance } as const;
  },

  async context() {
    const { instance, events } = await TestSample.controller();
    const context = await Context.init(instance);
    const ctx = context.ctx;
    context.dispose$.subscribe(() => events.dispose());
    const dispose = () => {
      context.dispose();
      events.dispose();
    };
    return { context, ctx, instance, events, dispose } as const;
  },
};
