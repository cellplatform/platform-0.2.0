import { Args } from '.';
import { describe, expect, it } from '../test';

describe('parseArgs (minimist)', () => {
  /**
   * NOTE: Example on the [minimist] README.
   *       https://github.com/minimistjs/minimist
   */
  const sample1 = {
    argv: '-a beep -b boop',
    parsed: { _: [], a: 'beep', b: 'boop' },
  };
  const sample2 = {
    argv: '-x 3 -y 4 -n5 -abc --beep=boop --no-ding foo bar baz',
    parsed: {
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

  describe('Args.parse', () => {
    it('parse: string', () => {
      const res1 = Args.parse(sample1.argv);
      const res2 = Args.parse(sample2.argv);
      expect(res1).to.eql(sample1.parsed);
      expect(res2).to.eql(sample2.parsed);
    });

    it('parse: array', () => {
      const args1 = Args.argv(sample1.argv);
      const args2 = Args.argv(sample2.argv);
      const res1 = Args.parse(args1);
      const res2 = Args.parse(args2);
      expect(res1).to.eql(sample1.parsed);
      expect(res2).to.eql(sample2.parsed);
    });
  });

  describe('Args.positional (formatted array)', () => {
    const argv = ' -a  foo  bar --b  ';

    it('default: arguments with empty spaces removed', () => {
      const res1 = Args.positional(argv);
      const res2 = Args.positional(Args.parse(argv));
      expect(res1).to.eql(['foo', 'bar']);
      expect(res2).to.eql(['foo', 'bar']);
    });

    it('override: raw arguments (spaces retained)', () => {
      const res1 = Args.positional(argv, { raw: true });
      const res2 = Args.positional(Args.parse(argv), { raw: true });
      expect(res1).to.eql(['', '', 'foo', '', 'bar', '']);
      expect(res2).to.eql(['', '', 'foo', '', 'bar', '']);
    });
  });
});
