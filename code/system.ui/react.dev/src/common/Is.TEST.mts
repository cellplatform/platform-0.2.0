import { Spec, SpecContext } from '../Spec';
import { describe, expect, it, rx, t } from '../test';
import { Is } from './Is.mjs';

describe('Is (flags)', () => {
  const bus = rx.bus();
  const instance: t.DevInstance = { bus, id: 'foo' };

  it('includes base methods', () => {
    expect(typeof Is.promise).to.eql('function');
  });

  it('ctx', async () => {
    const { ctx } = SpecContext.create(instance);

    const test = (input: any, expected: boolean) => {
      expect(Is.ctx(input)).to.eql(expected);
    };

    test(ctx, true);
    [undefined, null, {}, [], 123, 'foo', true].forEach((value) => test(value, false));
  });

  it('suite (spec)', () => {
    const suite = Spec.describe('foo');

    const test = (input: any, expected: boolean) => {
      expect(Is.suite(input)).to.eql(expected);
    };

    test(suite, true);
    [undefined, null, {}, [], 123, 'foo', true].forEach((value) => test(value, false));
  });

  it('test (it/spec)', () => {
    let _test: t.TestModel;
    const suite = Spec.describe('foo', (e) => {
      _test = e.it('bar');
    });

    const test = (input: any, expected: boolean) => {
      expect(Is.test(input)).to.eql(expected);
    };

    suite.init();

    test(_test!, true);
    test(suite, false);
    [undefined, null, {}, [], 123, 'foo', true].forEach((value) => test(value, false));
  });
});
