import { WebRuntimeBus } from '.';
import { describe, expect, it, rx } from '../test';

describe('Web.RuntimeBus (Events)', (e) => {
  describe('is', (e) => {
    const is = WebRuntimeBus.Events.is;

    it('is (static/instance)', () => {
      const instance = { bus: rx.bus() };
      const events = WebRuntimeBus.Events({ instance });
      expect(events.is).to.equal(is);
    });

    it('is.base', () => {
      const test = (type: string, expected: boolean) => {
        expect(is.base({ type, payload: {} })).to.eql(expected);
      };
      test('foo', false);
      test('sys.runtime.web/', true);
    });

    it('is.instance', () => {
      const type = 'sys.runtime.web/';
      expect(is.instance({ type, payload: { instance: 'abc' } }, 'abc')).to.eql(true);
      expect(is.instance({ type, payload: { instance: 'abc' } }, '123')).to.eql(false);
      expect(is.instance({ type: 'foo', payload: { instance: 'abc' } }, 'abc')).to.eql(false);
    });
  });

  describe('dispose/clone', (e) => {
    it('dispose', () => {
      const instance = { bus: rx.bus() };
      const events = WebRuntimeBus.Events({ instance });

      let count = 0;
      events.dispose$.subscribe(() => count++);

      events.dispose();
      events.dispose();
      events.dispose();

      expect(count).to.eql(1);
    });

    it('clone', () => {
      const instance = { bus: rx.bus() };
      const events1 = WebRuntimeBus.Events({ instance });
      const events2 = events1.clone();

      expect((events2 as any).dispose).to.eql(undefined);

      let count = 0;
      events1.dispose$.subscribe(() => count++);
      events2.dispose$.subscribe(() => count++);

      events1.dispose();
      expect(count).to.eql(2);
    });
  });
});
