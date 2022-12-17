import { Spec } from '.';
import { describe, expect, it, rx, slug, t } from '../test';
import { DevBus } from '../ui.Bus';
import { SpecContext } from './Spec.Context.mjs';

const bus = rx.bus();

describe('SpecContext', () => {
  const timeout = () => null as any;

  const Sample = {
    instance: () => ({ bus, id: `foo.${slug()}` }),
    create: () => SpecContext.create(Sample.instance()),
    ctx() {
      const instance = Sample.instance();
      const events = DevBus.Controller({ instance });
      const { dispose, dispose$ } = events;
      const wrapper = SpecContext.create(instance, { dispose$ });
      const ctx = Spec.ctx({ id: 'foo', ctx: wrapper.ctx, timeout, description: 'MyFoo' });
      return { ctx, wrapper, dispose, events };
    },
  };

  it('e.ctx(e)', () => {
    const instance = Sample.instance();
    const wrapper = SpecContext.create(instance);
    const ctx = Spec.ctx({ id: 'foo', ctx: wrapper.ctx, timeout, description: 'MyFoo' });
    expect(typeof ctx.component.render).to.eql('function');
    expect(typeof ctx.toObject).to.eql('function');
  });

  it('e.ctx(e): throw', () => {
    const fn = () => Spec.ctx({} as any);
    expect(fn).to.throw(/Expected a {ctx} object/);
  });

  it('unique {props.id}', () => {
    const instance = Sample.instance();
    const wrapper1 = SpecContext.create(instance);
    const wrapper2 = SpecContext.create(instance);
    expect(wrapper1.props.id).to.not.eql(wrapper2.props.id);
  });

  it('props.toObject', () => {
    const wrapper = Sample.create();
    const obj = wrapper.ctx.toObject();
    expect(obj.props).to.eql(wrapper.props);
    expect(obj.instance).to.equal(wrapper.instance);
  });

  describe('state', () => {
    type T = { count: number; msg?: string };
    const initial: T = { count: 0 };

    it('read state', async () => {
      const { ctx, dispose } = Sample.ctx();
      const state = await ctx.state<T>(initial);
      expect(state.current).to.eql(initial);
      dispose();
    });

    it('write state (change)', async () => {
      const { ctx, dispose } = Sample.ctx();
      const state = await ctx.state<T>(initial);
      expect(state.current).to.eql(initial);

      const res = await state.change((draft) => draft.count++);
      expect(res).to.eql({ count: 1 });
      expect(state.current).to.eql({ count: 1 });

      dispose();
    });

    it('causes [events.state.changed$] to fire', async () => {
      const { ctx, events } = Sample.ctx();

      const fired: t.DevInfoChanged[] = [];
      events.state.changed$.subscribe((e) => fired.push(e));

      const state = await ctx.state<T>({ count: 0 });
      await state.change((draft) => draft.count++);

      expect(fired.length).to.eql(1);
      expect(fired[0].message).to.eql('state:write');
      expect(fired[0].info.render.state).to.eql({ count: 1 });

      events.dispose();
    });

    it('revert to initial after reset', async () => {
      const { ctx, events, dispose } = Sample.ctx();
      const initial: T = { count: 0 };
      const state = await ctx.state<T>(initial);

      await state.change((draft) => draft.count++);
      expect(state.current).to.eql({ count: 1 });

      await ctx.reset();

      const info = await events.info.get();
      expect(state.current).to.eql(initial);
      expect(info.render.state).to.eql(undefined);

      dispose();
    });

    it('live updates (via event listeners)', async () => {
      const { ctx, dispose } = Sample.ctx();
      const initial: T = { count: 0 };
      const state1 = await ctx.state<T>(initial);
      const state2 = await ctx.state<T>(initial);

      await state1.change((draft) => (draft.msg = 'hello'));
      expect(state2.current).to.eql({ count: 0, msg: 'hello' });

      await state2.change((draft) => (draft.count = 1234));
      expect(state1.current).to.eql({ count: 1234, msg: 'hello' });

      dispose();
    });
  });

  describe('debug (panel)', () => {
    it('no renderers', async () => {
      const { dispose, wrapper } = Sample.ctx();
      expect(wrapper.props.debug.main.renderers).to.eql([]);
      dispose();
    });

    it('append renderer', async () => {
      const { ctx, dispose, wrapper } = Sample.ctx();
      const { renderers } = wrapper.props.debug.main;

      const fn: t.SubjectRenderer = (e) => undefined;
      ctx.debug.body(fn);

      expect(renderers.length).to.eql(1);
      expect(renderers[0]).to.equal(fn);

      dispose();
    });

    it.skip('reset clears renderers', async () => {
      const { ctx, dispose, wrapper, events } = Sample.ctx();
      const { renderers } = wrapper.props.debug.main;

      const fn: t.SubjectRenderer = (e) => undefined;

      ctx.debug.body(fn);
      expect(renderers.length).to.eql(1);

      await events.reset.fire();
      expect(renderers.length).to.eql(0);

      console.log('-------------------------------------');
      console.log('wrapper.props.debug.main', wrapper.props.debug.main);

      dispose();
    });
  });
});
