import { DevBus } from '.';
import { describe, expect, it, rx, slug, t, Test } from '../test';

import { SAMPLES } from '../test.sample/specs.unit-test';

describe('DevBus', (e) => {
  const Sample = {
    instance: () => ({ bus: rx.bus(), id: `foo.${slug()}` }),
    async create() {
      const instance = Sample.instance();
      return DevBus.Controller({ instance });
    },
    async preloaded() {
      const events = await Sample.create();
      await events.load.fire(SAMPLES.Sample1);
      return events;
    },
  };

  describe('is', (e) => {
    const is = DevBus.Events.is;

    it('is (static/instance)', () => {
      const instance = Sample.instance();
      const events = DevBus.Events({ instance });
      expect(events.is).to.equal(is);
    });

    it('is.base', () => {
      const test = (type: string, expected: boolean) => {
        expect(is.base({ type, payload: {} })).to.eql(expected);
      };
      test('foo', false);
      test('sys.dev/', true);
    });

    it('is.instance', () => {
      const type = 'sys.dev/';
      expect(is.instance({ type, payload: { instance: 'abc' } }, 'abc')).to.eql(true);
      expect(is.instance({ type, payload: { instance: 'abc' } }, '123')).to.eql(false);
      expect(is.instance({ type: 'foo', payload: { instance: 'abc' } }, 'abc')).to.eql(false);
    });
  });

  describe('Controller/Events', (e) => {
    it('dispose', () => {
      const instance = Sample.instance();
      const events = DevBus.Controller({ instance });
      expect(events.disposed).to.eql(false);

      events.dispose();
      expect(events.disposed).to.eql(true);
    });

    describe('info', () => {
      it('fire (read)', async () => {
        const instance = Sample.instance();
        const events = DevBus.Controller({ instance });
        const res = await events.info.fire();

        expect(res.instance).to.eql(instance.id);
        expect(res.info?.root).to.eql(undefined);

        events.dispose();
      });

      it('get', async () => {
        const instance = Sample.instance();
        const events = DevBus.Controller({ instance });
        const info1 = await events.info.get();
        const info2 = await events.info.get();

        expect(info1.run.count).to.eql(0);
        expect(info1).to.eql(info2);
        expect(info1).to.not.equal(info2);

        events.dispose();
      });
    });

    describe('load', () => {
      it('load (import bundle)', async () => {
        const instance = Sample.instance();
        const events = DevBus.Controller({ instance });

        const fired: t.DevInfoChanged[] = [];
        events.info.changed$.subscribe((e) => fired.push(e));

        const res = await events.load.fire(SAMPLES.Sample1);
        const root = await Test.bundle(SAMPLES.Sample1);

        expect(res.error).to.eql(undefined);
        expect(res.info?.root).to.not.eql(undefined);
        expect(res.info?.root).to.eql(root);

        const info = await events.info.get();
        expect(info.root).to.eql(root);

        expect(fired.length).to.eql(2);

        expect(fired[0].message).to.eql('context:init');
        expect(fired[0].info.root).to.eql(undefined);

        expect(fired[1].message).to.eql('spec:load');
        expect(fired[1].info.root).to.eql(info.root);

        events.dispose();
      });

      it('load (direct spec)', async () => {
        const instance = Sample.instance();
        const events = DevBus.Controller({ instance });

        const { root } = await SAMPLES.Sample1;
        const res = await events.load.fire(root);
        const info = await events.info.get();

        expect(res.error).to.eql(undefined);
        expect(res.info?.root).to.not.eql(undefined);
        expect(res.info?.root).to.eql(root);
        expect(info.root).to.eql(root);

        events.dispose();
      });

      it('unload', async () => {
        const instance = Sample.instance();
        const events = DevBus.Controller({ instance });
        const root = await Test.bundle(SAMPLES.Sample1);

        const fired: t.DevInfoChanged[] = [];
        events.info.changed$.subscribe((e) => fired.push(e));

        const res1 = await events.load.fire(SAMPLES.Sample1);
        expect(res1.info?.root).to.eql(root);

        type T = { count: number };
        await events.state.change.fire<T>({ initial: { count: 0 }, mutate: (d) => d.count++ });
        const info1 = await events.info.get();
        expect(info1.render.state).to.eql({ count: 1 });

        const res2 = await events.unload.fire();
        expect(res2.info?.root).to.eql(undefined);

        const info2 = await events.info.get();
        expect(info2?.root).to.eql(undefined);
        expect(info2.render.state).to.eql(undefined);

        events.dispose();
      });

      it('render context changes between load/unload', async () => {
        const events = await Sample.create();

        const getId = async () => (await events.info.get()).render.props?.id;
        const id1 = await getId();

        await events.load.fire(SAMPLES.Sample1);
        const id2 = await getId();

        await events.run.fire();
        const id3 = await getId();

        await events.run.fire(); // NB: Second run
        const id4 = await getId();

        await events.unload.fire();
        await events.load.fire(SAMPLES.Sample1);
        await events.run.fire();
        const id5 = await getId();

        expect(id1).to.eql(undefined);
        expect(id2).to.eql(undefined);
        expect(id3).to.match(/^render\./);
        expect(id4).to.eql(id3);

        // NB: changed after loading of new bundle.
        expect(id5).to.match(/^render\./);
        expect(id5).to.not.eql(id4);
      });
    });

    describe('run', () => {
      it('run', async () => {
        const events = await Sample.preloaded();

        const info1 = (await events.run.fire()).info;
        const info2 = (await events.run.fire()).info;
        const info3 = (await events.run.fire()).info;

        expect(info1?.run.count).to.eql(1);
        expect(info2?.run.count).to.eql(2);
        expect(info3?.run.count).to.eql(3);

        expect(info3?.run?.results?.description).to.eql('MySample');
        expect(info3?.render.props?.component.backgroundColor).to.eql(1);

        events.dispose();
      });

      it('run: suite not loaded', async () => {
        const events = await Sample.create();

        const info1 = (await events.run.fire()).info;
        expect(info1?.run.count).to.eql(0);
        expect(info1?.run.results).to.eql(undefined);
        expect(info1?.render.props).to.eql(undefined);

        events.dispose();
      });

      it('run: unload clears "run results"', async () => {
        const events = await Sample.preloaded();

        const info1 = (await events.run.fire()).info;
        expect(info1?.run.count).to.eql(1);
        expect(info1?.run.results).to.not.eql(undefined);

        await events.unload.fire();
        const info2 = await events.info.get();
        expect(info2?.run.count).to.eql(0);
        expect(info2?.run.results).to.eql(undefined);
        expect(info2?.render.props).to.eql(undefined);

        events.dispose();
      });

      it('run: { ctx.initial } flag', async () => {
        const { Wrapper } = await SAMPLES.Sample2;
        const sample = Wrapper();
        const events = await Sample.create();

        await sample.root.init();
        await events.load.fire(sample.root);

        await events.run.fire();
        expect(sample.log.items.every(({ ctx }) => ctx.initial)).to.eql(true);

        sample.log.reset();

        await events.run.fire();
        expect(sample.log.items.every(({ ctx }) => ctx.initial)).to.eql(false);

        events.dispose();
      });
    });

    describe('run ({ only } specific specs)', () => {
      it('target single spec (from initial run)', async () => {
        const { Wrapper } = await SAMPLES.Sample2;
        const sample = Wrapper();
        const events = await Sample.create();

        await sample.root.init();
        await events.load.fire(sample.root);
        expect(sample.log.count).to.eql(0);

        /**
         * TODO 🐷
         *
         * - Details on ctx:
         *    - parent
         *    - siblings ("its" and "describes")
         */

        const info1 = await events.info.get();
        const root = info1.root;
        const test1 = root?.state.tests[0];
        const test2 = root?.state.tests[1];
        expect(test1).to.exist;
        expect(test2).to.exist;
        expect(info1.render.props?.id).to.eql(undefined);

        /**
         * Run for the first time with a target ("filter on subset") value provided.
         * There is no prior context.
         * All tests should run.
         */
        await events.run.fire({ only: test1?.id });

        const info2 = await events.info.get();
        expect(info2.instance.context).to.eql(info1.instance.context);
        expect(info2.render.props?.id).to.exist;
        expect(info2.run.count).to.eql(1);
        expect(sample.log.count).to.eql(1);
        expect(sample.log.items[0].args.description).to.eql('init');

        sample.log.reset();

        /**
         * Run for a second time, the context (instance state) should NOT change
         * when a target ("filter on subset") is used.
         */
        await events.run.fire({ only: [test2?.id] as string[] });
        const info3 = await events.info.get();
        expect(info3.instance.context).to.eql(info2.instance.context);
        expect(info3.render.props?.id).to.eql(info2.render.props?.id); // NB: No change to the context (instance/state).
        expect(info3.run.count).to.eql(2);
        expect(sample.log.count).to.eql(1);
        expect(sample.log.items[0].args.description).to.eql('foo-1');

        sample.log.reset();

        /**
         * Run for a third time, but with NO target ("filter on subset") value provided.
         * Again, the context (instance state) is NOT CHANGED.
         */
        await events.run.fire({});
        const info4 = await events.info.get();
        expect(info4.render.props?.id).to.eql(info3.render.props?.id); // NB: No change to the context (instance/state).
        expect(info4.run.count).to.eql(3);
        expect(sample.log.count).to.eql(3);
        expect(sample.log.items.map((e) => e.args.description)).to.eql(['init', 'foo-1', 'foo-2']);

        events.dispose();
      });

      it('reset (context/state)', async () => {
        const events = await Sample.preloaded();

        /**
         * No change to context/state.
         */
        await events.run.fire({});
        const info1 = await events.info.get();

        await events.run.fire({});
        const info2 = await events.info.get();
        expect(info2.instance.context).to.eql(info1.instance.context);
        expect(info2.render.props?.id).to.eql(info1.render.props?.id); // NB: No change to the context (instance/state).

        events.reset.fire();

        // NB: instances changed.
        const info3 = await events.info.get();
        expect(info3.instance.context).to.not.eql(info2.instance.context);
        expect(info3.render.props?.id).to.not.eql(info2.render.props?.id);

        events.dispose();
      });
    });

    describe('state (context)', () => {
      type T = { msg?: string; count: number };

      it('updates state', async () => {
        const events = await Sample.preloaded();
        const info1 = await events.info.get();
        expect(info1.render.state).to.eql(undefined);

        let _initial: T | undefined;

        await events.state.change.fire<T>({
          initial: { count: 0 },
          mutate: (draft) => {
            _initial = { ...draft };
            draft.msg = 'hello';
            draft.count++;
          },
        });

        const info2 = await events.info.get();
        expect(_initial).to.eql({ count: 0 });
        expect(info2.render.state).to.eql({ count: 1, msg: 'hello' });

        events.dispose();
      });

      it('reset state (remove)', async () => {
        const events = await Sample.preloaded();

        const initial: T = { count: 0 };
        await events.state.change.fire<T>({ initial, mutate: (draft) => draft.count++ });
        const info1 = await events.info.get();
        expect(info1.render.state).to.eql({ count: 1 });

        await events.reset.fire();

        const info2 = await events.info.get();
        expect(info2.render.state).to.eql(undefined);

        events.dispose();
      });
    });
  });
});
