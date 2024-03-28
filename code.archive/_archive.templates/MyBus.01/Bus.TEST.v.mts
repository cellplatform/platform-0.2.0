import { MyBus } from '.';
import { describe, it, expect, Pkg, rx, slug } from '../test';

describe('MyBus', (e) => {
  const Create = {
    instance: () => ({ bus: rx.bus(), id: `foo.${slug()}` }),
  };

  describe('is', (e) => {
    const is = MyBus.Events.is;

    it('is (static/instance)', () => {
      const instance = Create.instance();
      const events = MyBus.Events({ instance });
      expect(events.is).to.equal(is);
    });

    it('is.base', () => {
      const test = (type: string, expected: boolean) => {
        expect(is.base({ type, payload: {} })).to.eql(expected);
      };
      test('foo', false);
      test('my.namespace/', true);
    });

    it('is.instance', () => {
      const type = 'my.namespace/';
      expect(is.instance({ type, payload: { instance: 'abc' } }, 'abc')).to.eql(true);
      expect(is.instance({ type, payload: { instance: 'abc' } }, '123')).to.eql(false);
      expect(is.instance({ type: 'foo', payload: { instance: 'abc' } }, 'abc')).to.eql(false);
    });
  });

  describe('Controller/Events', (e) => {
    it('info', async () => {
      const instance = Create.instance();
      const events = MyBus.Controller({ instance });
      const res = await events.info.fire();

      expect(res.instance).to.eql(instance.id);
      expect(res.info?.module.name).to.eql(Pkg.name);
      expect(res.info?.module.version).to.eql(Pkg.version);

      events.dispose();
    });
  });
});
