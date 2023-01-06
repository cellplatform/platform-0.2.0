import { Context } from '.';
import { DEFAULT, describe, expect, Id, it, t, TestSample } from '../test';

export function expectRendererId(value?: string) {
  expect(value?.startsWith(Id.renderer.prefix)).to.eql(true);
}

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
  });

  describe('props.component', () => {
    it('component', async () => {
      const { events, context, dispose } = await TestSample.context();
      const ctx = context.ctx;

      const fn = () => null;
      ctx.component.backgroundColor(-0.2).display('flex').size(10, 20).render(fn);

      expect(context.pending).to.eql(true);
      await context.flush();
      expect(context.pending).to.eql(false);

      const info = await events.info.get();
      const component = info.render.props?.component!;

      expect(component.backgroundColor).to.eql(-0.2);
      expect(component.display).to.eql('flex');
      expect(component.renderer?.fn).to.eql(fn);
      expectRendererId(component.renderer?.id);
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
      await test({ mode: 'center', width: undefined, height: 100 }, (size) => size(null, 100));
      await test({ mode: 'center', width: 200, height: undefined }, (size) => size(200, null));

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
  });

  describe('props.host', () => {
    const HOST = DEFAULT.props.host;

    it('color', async () => {
      const { events, context, dispose } = await TestSample.context();
      const ctx = context.ctx;

      const getHost = async () => (await events.info.get()).render?.props?.host!;

      ctx.host.backgroundColor(-0.123);
      ctx.host.gridColor(-0.456);
      expect(context.pending).to.eql(true);
      await context.flush();
      expect(context.pending).to.eql(false);

      const info1 = await getHost();
      expect(info1.backgroundColor).to.eql(-0.123);
      expect(info1.gridColor).to.eql(-0.456);

      ctx.host.backgroundColor(null);
      ctx.host.gridColor(null);
      await context.flush();

      const info2 = await getHost();
      expect(info2.backgroundColor).to.eql(HOST.backgroundColor);
      expect(info2.gridColor).to.eql(HOST.gridColor);

      dispose();
    });
  });

  describe('props.debug', () => {
    it('row: renderer (fn)', async () => {
      const { events, context, dispose } = await TestSample.context();
      const ctx = context.ctx;

      const fn = () => undefined;
      const res = ctx.debug.row(fn);
      expectRendererId(res.id);

      expect(context.pending).to.eql(true);
      await context.flush();
      expect(context.pending).to.eql(false);

      const info = await events.info.get();
      const debug = info.render.props?.debug!;

      expect(debug.body.renderers.length).to.eql(1);
      expect(debug.body.renderers[0].id).to.eql(res.id);
      expect(debug.body.renderers[0].fn).to.eql(fn);
      dispose();
    });

    it('row: <Element> wrapped into renderer function', async () => {
      const { events, context, dispose } = await TestSample.context();
      const ctx = context.ctx;

      const el = <div>Foo</div>;
      const res = ctx.debug.row(el);
      expectRendererId(res.id);

      await context.flush();

      const info = await events.info.get();
      const debug = info.render.props?.debug!;
      const fn = debug.body.renderers[0].fn;

      expect(debug.body.renderers.length).to.eql(1);
      expect(debug.body.renderers[0].id).to.eql(res.id);
      expect(fn).to.be.a('function');
      expect(fn({} as any)).to.equal(el);
      dispose();
    });

    it('scroll', async () => {
      const { events, context, dispose } = await TestSample.context();
      const ctx = context.ctx;

      const expectValue = async (expected: boolean | undefined) => {
        await context.flush();
        const info = await events.info.get();
        expect(info.render.props?.debug.body.scroll).to.eql(expected);
      };

      await expectValue(undefined);

      ctx.debug.scroll(true);
      await expectValue(true);

      ctx.debug.scroll(false);
      await expectValue(false);

      dispose();
    });

    it('padding', async () => {
      const { events, context, dispose } = await TestSample.context();
      const ctx = context.ctx;

      type T = t.MarginInput | undefined | null;
      const expectValue = async (value: T, expected: t.Margin) => {
        ctx.debug.padding(value);
        await context.flush();
        const info = await events.info.get();
        expect(info.render.props?.debug.body.padding).to.eql(expected);
      };

      const DEBUG = DEFAULT.props.debug.body;

      await expectValue(undefined, DEBUG.padding);
      await expectValue(null, DEBUG.padding);

      await expectValue(10, [10, 10, 10, 10]);
      await expectValue([10], [10, 10, 10, 10]);
      await expectValue([10, 99], [10, 99, 10, 99]);
      await expectValue([10, 20, 30, 40], [10, 20, 30, 40]);

      dispose();
    });

    describe('header', () => {
      it('header.render', async () => {
        const { events, context, dispose } = await TestSample.context();
        const ctx = context.ctx;
        const el = <div>Hello</div>;
        const fn = () => el;
        const getHeader = async () => (await events.info.get()).render.props?.debug.header;

        const info1 = await getHeader();
        expect(info1?.renderer).to.eql(undefined);

        ctx.debug.header.render(fn);
        await context.flush();

        const info2 = await getHeader();
        expectRendererId(info2?.renderer?.id);
        expect(info2?.renderer?.fn).to.equal(fn);

        ctx.debug.header.render(el);
        await context.flush();

        const info3 = await getHeader();
        expectRendererId(info3?.renderer?.id);
        expect(info3?.renderer?.fn({} as any)).to.equal(el);

        dispose();
      });
    });

    describe('footer', () => {
      it('footer.render', async () => {
        const { events, context, dispose } = await TestSample.context();
        const ctx = context.ctx;
        const el = <div>Hello</div>;
        const fn = () => el;
        const getFooter = async () => (await events.info.get()).render.props?.debug.footer;

        const info1 = await getFooter();
        expect(info1?.renderer).to.eql(undefined);

        ctx.debug.footer.render(fn);
        await context.flush();

        const info2 = await getFooter();
        expectRendererId(info2?.renderer?.id);
        expect(info2?.renderer?.fn).to.equal(fn);

        ctx.debug.footer.render(el);
        await context.flush();

        const info3 = await getFooter();
        expectRendererId(info3?.renderer?.id);
        expect(info3?.renderer?.fn({} as any)).to.equal(el);

        dispose();
      });
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
