import { Context } from '.';
import { Id, t, describe, expect, expectError, it, TestSample } from '../test';

describe('Context', () => {
  describe('lifecycle', () => {
    it('init', async () => {
      const { events, instance } = await TestSample.create();

      const info = await events.info.get();
      expect(info.render.props).to.eql(undefined); // Initially no render-props data.

      const context = await Context.init(instance);
      expect(context.instance).to.equal(instance);
      expect(context.disposed).to.eql(false);
      expect(context.pending).to.eql(false);

      context.dispose();
      events.dispose();
    });

    it('dispose', async () => {
      const { dispose, context, events } = await TestSample.context();

      let fired = 0;
      events.dispose$.subscribe(() => fired++);
      context.dispose$.subscribe(() => fired++);

      dispose();
      expect(fired).to.eql(2);
      expect(context.disposed).to.eql(true);
    });

    it('toObject', async () => {
      const { dispose, context, events } = await TestSample.context();

      const obj = context.toObject();
      const info = await events.info.get();

      expect(obj).to.eql(context.ctx.toObject());
      expect(obj).to.not.equal(context.ctx.toObject());
      expect(obj.id).to.eql(info.instance.session);
      expect(obj.instance).to.equal(context.instance);

      dispose();
    });
  });

  describe('modify => flush', () => {
    it('updates appear in bus/tree after flush', async () => {
      const { events, context, dispose } = await TestSample.context();

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
      const { context, dispose } = await TestSample.context();
      context.dispose();
      await expectError(() => context.flush(), 'Cannot flush, context has been disposed');
      dispose();
    });
  });

  describe('props', () => {
    it('component', async () => {
      const { events, context, dispose } = await TestSample.context();
      const ctx = context.ctx;

      const fn = () => undefined;
      ctx.component.backgroundColor(-0.2).display('flex').size(10, 20).render(fn);

      expect(context.pending).to.eql(true);
      await context.flush();
      expect(context.pending).to.eql(false);

      const info = await events.info.get();
      const component = info.render.props?.component!;

      expect(component.backgroundColor).to.eql(-0.2);
      expect(component.display).to.eql('flex');
      expect(component.renderer?.fn).to.eql(fn);
      expect(component.renderer?.id.startsWith(Id.renderer.prefix)).to.eql(true);
      expect(component.size).to.eql({ mode: 'center', width: 10, height: 20 });
      dispose();
    });

    it('component.size', async () => {
      const { events, context, dispose } = await TestSample.context();
      const ctx = context.ctx;

      const test = async (
        expected: t.DevRenderSize,
        modify: (size: t.DevCtxComponent['size']) => void,
      ) => {
        modify(ctx.component.size);
        await context.flush();
        const info = await events.info.get();
        expect(info.render.props?.component.size).to.eql(expected);
      };

      await test({ mode: 'center', width: 10, height: 20 }, (size) => size(10, 20));
      await test({ mode: 'center', width: undefined, height: 20 }, (size) => size(undefined, 20));
      await test({ mode: 'center', width: 10, height: undefined }, (size) => size(10, undefined));

      const margin = [50, 50, 50, 50] as t.Margin;
      await test({ mode: 'fill', x: true, y: true, margin }, (size) => size('fill'));
      await test({ mode: 'fill', x: true, y: false, margin }, (size) => size('fill-x'));
      await test({ mode: 'fill', x: false, y: true, margin }, (size) => size('fill-y'));

      await test({ mode: 'fill', x: true, y: true, margin: [10, 10, 10, 10] }, (size) =>
        size('fill', 10),
      );

      await test({ mode: 'fill', x: true, y: true, margin: [1, 2, 3, 4] }, (size) =>
        size('fill', [1, 2, 3, 4]),
      );

      dispose();
    });

    it('host', async () => {
      const { events, context, dispose } = await TestSample.context();
      const ctx = context.ctx;

      ctx.host.backgroundColor(-0.22);

      expect(context.pending).to.eql(true);
      await context.flush();
      expect(context.pending).to.eql(false);

      const info = await events.info.get();
      const host = info.render.props?.host!;

      expect(host.backgroundColor).to.eql(-0.22);
      dispose();
    });

    it('debug', async () => {
      const { events, context, dispose } = await TestSample.context();
      const ctx = context.ctx;

      const fn = () => undefined;
      const res = ctx.debug.row(fn);
      expect(res.id.startsWith(Id.renderer.prefix)).to.eql(true);

      expect(context.pending).to.eql(true);
      await context.flush();
      expect(context.pending).to.eql(false);

      const info = await events.info.get();
      const debug = info.render.props?.debug!;

      expect(debug.main.renderers.length).to.eql(1);
      expect(debug.main.renderers[0].fn).to.eql(fn);
      expect(debug.main.renderers[0].id).to.eql(res.id);
      dispose();
    });
  });

  describe('state', () => {
    type T = { count: number; msg?: string };
    const initial: T = { count: 0 };

    it('read state', async () => {
      const { context, dispose } = await TestSample.context();
      const ctx = context.ctx;
      const state = await ctx.state<T>(initial);
      expect(state.current).to.eql(initial);
      dispose();
    });

    it('write state (change)', async () => {
      const { context, dispose } = await TestSample.context();
      const ctx = context.ctx;
      const state = await ctx.state<T>(initial);
      expect(state.current).to.eql(initial);

      const res = await state.change((draft) => draft.count++);
      expect(res).to.eql({ count: 1 });
      expect(state.current).to.eql({ count: 1 });

      dispose();
    });

    it('causes [events.state.changed$] to fire', async () => {
      const { events, context, dispose } = await TestSample.context();
      const ctx = context.ctx;
      const state = await ctx.state<T>({ count: 0 });

      const fired: t.DevInfoChanged[] = [];
      events.state.changed$.subscribe((e) => fired.push(e));

      await state.change((draft) => draft.count++);

      expect(fired.length).to.eql(1);
      expect(fired[0].message).to.eql('state:write');
      expect(fired[0].info.render.state).to.eql({ count: 1 });

      dispose();
    });

    it('live updates (via event listeners)', async () => {
      const { context, dispose } = await TestSample.context();
      const ctx = context.ctx;
      const state1 = await ctx.state<T>(initial);
      const state2 = await ctx.state<T>(initial);

      await state1.change((draft) => (draft.msg = 'hello'));
      expect(state2.current).to.eql({ count: 0, msg: 'hello' });

      await state2.change((draft) => (draft.count = 1234));
      expect(state1.current).to.eql({ count: 1234, msg: 'hello' });

      dispose();
    });
  });
});
