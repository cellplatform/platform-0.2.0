import { Context } from '.';
import { describe, expect, expectError, it, TestSample } from '../test';

describe('Context', () => {
  const Sample = {
    async create() {
      const { instance, events } = await TestSample.create();
      const context = await Context.init(instance);
      context.dispose$.subscribe(() => events.dispose());
      const dispose = () => context.dispose();
      return { context, instance, events, dispose };
    },
  };

  describe('lifecycle', () => {
    it('init', async () => {
      const { events, instance } = await TestSample.create();

      const info1 = await events.info.get();
      expect(info1.render.props).to.eql(undefined); // Initially no render-props data.

      const context = await Context.init(instance);
      expect(context.instance).to.equal(instance);
      expect(context.disposed).to.eql(false);
      expect(context.pending).to.eql(false);

      context.dispose();
      events.dispose();
    });

    it('dispose', async () => {
      const { dispose, context, events } = await Sample.create();

      let fired = 0;
      events.dispose$.subscribe(() => fired++);
      context.dispose$.subscribe(() => fired++);

      dispose();
      expect(fired).to.eql(2);
      expect(context.disposed).to.eql(true);
    });
  });

  describe('state modification', () => {
    it('update => flush', async () => {
      const { events, context, dispose } = await Sample.create();

      const info1 = await events.info.get();
      expect(info1.render.props).to.eql(undefined); // NB: Initially no render-props data.
      expect(context.pending).to.eql(false);

      const ctx = context.ctx;
      ctx.component.backgroundColor(-0.3);

      const info2 = await events.info.get();
      expect(info2.render.props).to.eql(undefined); // NB: Not flushed yet.
      expect(context.pending).to.eql(true);

      await context.flush();

      const info3 = await events.info.get();
      expect(info3.render.props?.component.backgroundColor).to.eql(-0.3);
      expect(context.pending).to.eql(false);

      dispose();
    });

    it('synced between instances on same bus (single source of truth)', async () => {
      const { instance } = await TestSample.create();
      const context1 = await Context.init(instance);
      const context2 = await Context.init(instance);

      context1.ctx.component.backgroundColor(-0.1);
      await context1.flush();

      // NB: Only one of the context has been flushed. Both yield the same updated data.
      expect(context1.toObject().props.component.backgroundColor).to.eql(-0.1);
      expect(context2.toObject().props.component.backgroundColor).to.eql(-0.1);

      context1.dispose();
      context2.dispose();
    });

    it('throw: when disposed', async () => {
      const { context, dispose } = await Sample.create();
      context.dispose();
      await expectError(() => context.flush(), 'Context has been disposed');
      dispose();
    });
  });
});
