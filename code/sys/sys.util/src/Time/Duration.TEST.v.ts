import { expect, describe, it } from '../test';
import { time } from '.';
import { Duration } from './Duration';

const MSEC = 1;
const SEC = MSEC * 1000;
const MIN = SEC * 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;

describe('duration', () => {
  it('time.duration(...)', () => {
    const res1 = time.duration(123);
    const res2 = time.duration('3.5h');
    expect(res1.msec).to.eql(123);
    expect(res2.hour).to.eql(3.5);
  });

  it('toString()', () => {
    const res = time.duration(1025);
    expect(res.msec).to.eql(1025);
    expect(res.toString()).to.eql('1s');
    expect(res.toString('ms')).to.eql('1025ms');
  });

  it('toString (round)', () => {
    const duration = time.duration(1258);
    const res1 = duration.toString();
    const res2 = duration.toString({ round: 1 });
    const res3 = duration.toString({ round: 3 });

    expect(res1).to.eql('1s'); // NB: using toString()
    expect(res2).to.eql('1.3s');
    expect(res3).to.eql('1.258s');
  });

  it('forces anything less than zero to -1', () => {
    expect(Duration.create(-0.000001).msec).to.eql(-1);
  });

  it('ok: true', () => {
    expect(time.duration(123).ok).to.eql(true);
    expect(time.duration(0).ok).to.eql(true);
  });

  it('ok: false', () => {
    expect(time.duration(-1).ok).to.eql(false);
    expect(time.duration(-0.001).ok).to.eql(false);
  });

  it('parse', () => {
    const test = (input: string | number, msecs: number) => {
      const res = Duration.parse(input);
      expect(res.msec).to.eql(msecs);
    };

    test(0, 0);
    test(123, 123);
    test(123.5, 123.5);

    test('0', 0);
    test('  0   ', 0);
    test('123ms', 123);
    test('123 ms', 123);
    test('123.5ms  ', 123.5);

    test('1s', SEC);
    test('1m', MIN);
    test('1h', HOUR);
    test('1d', DAY);

    test('1sec', SEC);
    test('1min', MIN);
    test('1hour', HOUR);
    test('1day', DAY);

    test('1 sec', SEC);
    test('1 min', MIN);
    test('1 hour', HOUR);
    test('1 day', DAY);

    // Invalid.
    test('', -1);
    test('-1', -1);
    test('-10s', -1);
    test('123. 5ms  ', -1);
    test('123 .5ms  ', -1);
    test('123 .5', -1);
  });
});
