import { describe, expect, it } from '../test';
import { BusEvents } from '.';

describe('BusEvents', () => {
  const is = BusEvents.is;

  it('✨✨ See [BusController] tests', () => {
    //
  });

  it('is.base', () => {
    const test = (type: string, expected: boolean) => {
      expect(is.base({ type, payload: {} })).to.eql(expected);
    };
    test('foo', false);
    test('vendor.vercel/', true);
  });

  it('is.instance', () => {
    const res1 = is.instance({ type: 'vendor.vercel/', payload: { instance: 'abc' } }, 'abc');
    const res2 = is.instance({ type: 'vendor.vercel/', payload: { instance: 'abc' } }, '123');
    const res3 = is.instance({ type: 'foo', payload: { instance: 'abc' } }, 'abc');

    expect(res1).to.eql(true);
    expect(res2).to.eql(false);
    expect(res3).to.eql(false);
  });
});
