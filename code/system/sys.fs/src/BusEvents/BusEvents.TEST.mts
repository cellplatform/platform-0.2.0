import { BusEvents } from '.';
import { expect, describe, it } from '../test';

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
    test('sys.fs/', true);
  });

  it('is.instance', async () => {
    expect(is.instance({ type: 'sys.fs/', payload: { id: 'abc' } }, 'abc')).to.eql(true);
    expect(is.instance({ type: 'sys.fs/', payload: { id: 'abc' } }, '123')).to.eql(false);
    expect(is.instance({ type: 'foo', payload: { id: 'abc' } }, 'abc')).to.eql(false);
  });
});
