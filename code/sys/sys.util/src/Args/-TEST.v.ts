import { Args } from '.';
import { describe, expect, it } from '../test';

describe('parseArgs (minimist)', () => {
  /**
   * NOTE: Example on the [minimist] README.
   *       https://github.com/minimistjs/minimist
   */
  const sample1 = {
    text: '-a beep -b boop',
    result: { _: [], a: 'beep', b: 'boop' },
  };
  const sample2 = {
    text: '-x 3 -y 4 -n5 -abc --beep=boop --no-ding foo bar baz',
    result: {
      _: ['foo', 'bar', 'baz'],
      x: 3,
      y: 4,
      n: 5,
      a: true,
      b: true,
      c: true,
      beep: 'boop',
      ding: false,
    },
  };

  it('parse string', () => {
    const res1 = Args.parse(sample1.text);
    const res2 = Args.parse(sample2.text);
    expect(res1).to.eql(sample1.result);
    expect(res2).to.eql(sample2.result);
  });

  it('parse array', () => {
    const args1 = Args.asArray(sample1.text);
    const args2 = Args.asArray(sample2.text);
    const res1 = Args.parse(args1);
    const res2 = Args.parse(args2);
    expect(res1).to.eql(sample1.result);
    expect(res2).to.eql(sample2.result);
  });
});
