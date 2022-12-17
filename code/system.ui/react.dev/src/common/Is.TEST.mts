import { describe, it, expect, t, rx } from '../test';
import { Is } from './Is.mjs';
import { SpecContext } from '../Spec';

describe('Is (flags)', () => {
  const bus = rx.bus();
  const instance: t.DevInstance = { bus, id: 'foo' };

  it('includes base methods', () => {
    expect(typeof Is.promise).to.eql('function');
    expect(typeof Is.observable).to.eql('function');
  });

  it('ctx', async () => {
    const test = (input: any, expected: boolean) => {
      expect(Is.ctx(input)).to.eql(expected);
    };

    const { ctx } = SpecContext.create(instance);
    test(ctx, true);

    test(undefined, false);
    test(null, false);
    test({}, false);
    test(123, false);
  });
});
