import { expect, rx, Dev } from '../test.ui';
import { WebRuntimeBus } from '.';

export default Dev.describe('Web.RuntimeBus (Events)', (e) => {
  e.describe('is', (e) => {
    const is = WebRuntimeBus.Events.is;

    e.it('is (static/instance)', () => {
      const instance = { bus: rx.bus() };
      const events = WebRuntimeBus.Events({ instance });
      expect(events.is).to.equal(is);
    });

    e.it('is.base', () => {
      const test = (type: string, expected: boolean) => {
        expect(is.base({ type, payload: {} })).to.eql(expected);
      };
      test('foo', false);
      test('sys.runtime.web/', true);
    });

    e.it('is.instance', () => {
      const type = 'sys.runtime.web/';
      expect(is.instance({ type, payload: { instance: 'abc' } }, 'abc')).to.eql(true);
      expect(is.instance({ type, payload: { instance: 'abc' } }, '123')).to.eql(false);
      expect(is.instance({ type: 'foo', payload: { instance: 'abc' } }, 'abc')).to.eql(false);
    });
  });

  e.describe('dispose/clone', (e) => {
    e.it('dispose', () => {
      const instance = { bus: rx.bus() };
      const events = WebRuntimeBus.Events({ instance });

      let count = 0;
      events.dispose$.subscribe(() => count++);

      events.dispose();
      events.dispose();
      events.dispose();

      expect(count).to.eql(1);
    });

    e.it('clone', () => {
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
