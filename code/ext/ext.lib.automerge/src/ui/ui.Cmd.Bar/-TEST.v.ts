import { CmdBar, DEFAULTS } from '.';
import { A, describe, expect, it, type t } from '../../test';
import { Tx } from './u';

describe('Cmd.Bar', () => {
  describe('Path (resolver)', () => {
    const resolver = CmdBar.Path.resolver;

    it('default paths', () => {
      const resolve = resolver(DEFAULTS.paths);
      const tx = 'tx.123';
      const obj: t.CmdBarLens = { text: 'hello', tx };
      expect(resolve.text(obj)).to.eql('hello');
      expect(resolve.tx(obj)).to.eql(tx);
      expect(resolve.doc(obj)).to.eql({ text: 'hello', tx });
    });

    it('custom paths', () => {
      const resolve = resolver({
        text: ['x', 'y', 'text'],
        tx: ['x', 'tx'],
      });
      const tx = 'tx.123';
      const obj = {
        foo: { selected: 'abc', uri: 'def' },
        x: { y: { text: 'hello' }, tx },
        z: { foobar: new A.Counter() },
      };
      expect(resolve.text(obj)).to.eql('hello');
      expect(resolve.tx(obj)).to.eql(tx);
      expect(resolve.doc(obj)).to.eql({ text: 'hello', tx });
    });
  });

  describe('Tx', () => {
    it('next (generate)', () => {
      const instance = 'foo';
      const res1 = Tx.next(instance, 'Invoke');
      const res2 = Tx.next(`  ${instance}  `, 'Invoke');
      const res3 = Tx.next('', 'Invoke');
      expect(res1.includes(`:inst.${instance}`)).to.eql(true);
      expect(res1.includes('tx.')).to.eql(true);
      expect(res1.includes('cmd.Invoke')).to.eql(true);

      expect(res2.includes(`:inst.${instance}`)).to.eql(true);
      expect(res3.includes(`:inst.unknown`)).to.eql(true);
    });

    it('next: throw invalid "instance"', () => {
      const fn = () => Tx.next('foo:bar', 'Invoke');
      expect(fn).to.throw(/instance cannot contain colon/);
    });

    it('next: throw invalid action type', () => {
      const fn = () => Tx.next('foo', 'WRONG' as any);
      expect(fn).to.throw(/invalid action type/);
    });

    it('parse', () => {
      const tx = '  tx.123:inst.foo:cmd.Invoke  ';
      const res = Tx.parse(tx);
      expect(res.ok).to.eql(true);
      expect(res.tx).to.eql('123');
      expect(res.instance).to.eql('foo');
      expect(res.cmd).to.eql('Invoke');
      expect(res.raw).to.eql(tx);
    });

    it('parse: invalid', () => {
      const test = (tx: string, error: string) => {
        const res = Tx.parse(tx);
        expect(res.ok).to.eql(false);
        expect(res.tx).to.eql('');
        expect(res.instance).to.eql('');
        expect(res.cmd).to.eql(undefined);
        expect(res.raw).to.eql(tx);
        expect(res.error?.includes(error)).to.eql(true, error);
      };
      test('', 'No input');
      test('  ', 'No input');
      test('foobar', 'No "tx:"');
      test(' tx.123:inst.:cmd.Invoke ', 'No "inst:"');
      test(' tx.:inst.foo:cmd.Invoke ', 'No "tx:"');
      test(' tx.123:inst.foo: ', 'No "cmd:"');
      test(' tx.123:inst.foo:cmd. ', 'No "cmd:"');
      test(' tx.123:inst.foo:cmd.FAIL ', 'Invalid cmd action: "FAIL"');
    });
  });
});
