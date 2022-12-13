import { DevBus } from '.';
import { describe, expect, it, rx, slug, t, Test } from '../test';

const SAMPLE_IMPORT = import('../test.sample/MySample.SPEC');

describe('DevBus', (e) => {
  const Create = {
    instance: () => ({ bus: rx.bus(), id: `foo.${slug()}` }),
  };

  describe('is', (e) => {
    const is = DevBus.Events.is;

    it('is (static/instance)', () => {
      const instance = Create.instance();
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
    describe('info', () => {
      it('fire (read)', async () => {
        const instance = Create.instance();
        const events = DevBus.Controller({ instance });
        const res = await events.info.fire();

        expect(res.instance).to.eql(instance.id);
        expect(res.info?.root).to.eql(undefined);

        events.dispose();
      });

      it('get', async () => {
        const instance = Create.instance();
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
      it('load', async () => {
        const instance = Create.instance();
        const events = DevBus.Controller({ instance });

        const fired: t.DevInfoChanged[] = [];
        events.info.changed$.subscribe((e) => fired.push(e));

        const res = await events.load.fire(SAMPLE_IMPORT);
        const root = await Test.bundle(SAMPLE_IMPORT);

        expect(res.error).to.eql(undefined);
        expect(res.info?.root).to.not.eql(undefined);
        expect(res.info?.root).to.eql(root);

        const current = await events.info.get();
        expect(current.root).to.eql(root);

        expect(fired.length).to.eql(1);
        expect(fired[0].message).to.eql('spec:load');
        expect(fired[0].info.root).to.eql(current.root);

        events.dispose();
      });

      it('unload', async () => {
        const instance = Create.instance();
        const events = DevBus.Controller({ instance });

        const fired: t.DevInfoChanged[] = [];
        events.info.changed$.subscribe((e) => fired.push(e));

        const res1 = await events.load.fire(SAMPLE_IMPORT);
        const root = await Test.bundle(SAMPLE_IMPORT);
        expect(res1.info?.root).to.eql(root);

        const res2 = await events.unload.fire();
        expect(res2.info?.root).to.eql(undefined);

        expect(fired.length).to.eql(2);
        expect(fired[0].message).to.eql('spec:load');
        expect(fired[1].message).to.eql('spec:unload');
        expect(fired[1].info.root).to.eql(undefined);

        const info = await events.info.get();
        expect(info?.root).to.eql(undefined);

        events.dispose();
      });
    });

    describe('run', () => {
      it('run', async () => {
        const instance = Create.instance();
        const events = DevBus.Controller({ instance });
        await events.load.fire(SAMPLE_IMPORT);

        const info1 = (await events.run.fire()).info;
        const info2 = (await events.run.fire()).info;
        const info3 = (await events.run.fire()).info;

        expect(info1?.run.count).to.eql(1);
        expect(info2?.run.count).to.eql(2);
        expect(info3?.run.count).to.eql(3);

        const run = info3?.run;
        expect(run?.results?.description).to.eql('MySample');
        expect(run?.props?.component.backgroundColor).to.eql(1);

        events.dispose();
      });

      it('run: suite not loaded', async () => {
        const instance = Create.instance();
        const events = DevBus.Controller({ instance });

        const info1 = (await events.run.fire()).info;
        expect(info1?.run.count).to.eql(0);
        expect(info1?.run.results).to.eql(undefined);
        expect(info1?.run.props).to.eql(undefined);

        events.dispose();
      });

      it('run: unload clears results', async () => {
        const instance = Create.instance();
        const events = DevBus.Controller({ instance });
        await events.load.fire(SAMPLE_IMPORT);

        const info1 = (await events.run.fire()).info;
        expect(info1?.run.count).to.eql(1);
        expect(info1?.run.results).to.not.eql(undefined);

        await events.unload.fire();
        const info2 = await events.info.get();
        expect(info2?.run.count).to.eql(0);
        expect(info2?.run.results).to.eql(undefined);
        expect(info2?.run.props).to.eql(undefined);

        events.dispose();
      });
    });
  });
});
