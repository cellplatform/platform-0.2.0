import { DevBus } from '.';
import { describe, it, expect, Pkg, rx, slug, Test } from '../test';

const SAMPLE_IMPORT = import('../test.sample/MySample.SPEC');

describe('MyBus', (e) => {
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
    it('info', async () => {
      const instance = Create.instance();
      const events = DevBus.Controller({ instance });
      const res = await events.info.get();
      events.dispose();

      expect(res.instance).to.eql(instance.id);
      expect(res.info?.root).to.eql(undefined);
    });

    it('load', async () => {
      const instance = Create.instance();
      const events = DevBus.Controller({ instance });

      const res = await events.load.fire(SAMPLE_IMPORT);
      const root = await Test.bundle(SAMPLE_IMPORT);

      expect(res.error).to.eql(undefined);
      expect(res.info?.root).to.not.eql(undefined);
      expect(res.info?.root).to.eql(root);

      const current = await events.info.get();
      expect(current.info?.root).to.eql(root);

      events.dispose();
    });

    it('unload', async () => {
      const instance = Create.instance();
      const events = DevBus.Controller({ instance });

      const res1 = await events.load.fire(SAMPLE_IMPORT);
      const root = await Test.bundle(SAMPLE_IMPORT);
      expect(res1.info?.root).to.eql(root);

      await events.unload();
      const res2 = await events.unload();
      expect(res2.info?.root).to.eql(undefined);
      expect((await events.info.get()).info?.root).to.eql(undefined);
    });
  });
});
