import { Cmd } from '..';
import { Time, type t } from './common';

import type { C, C1 } from './t';
const DEFAULTS = Cmd.DEFAULTS;

export function cmdTests(setup: t.CmdTestSetup, args: t.TestArgs) {
  const { describe, it, expect } = args;

  describe('Cmd', () => {
    it('Cmd.DEFAULTS', () => {
      expect(Cmd.DEFAULTS).to.eql(DEFAULTS);

      expect(DEFAULTS.counter.create()).to.eql({ value: 0 });
      expect(DEFAULTS.counter.create(123)).to.eql({ value: 123 });
      expect(DEFAULTS.counter.create()).to.not.equal(DEFAULTS.counter.create());

      const error: t.Error = { message: '🍌' };
      expect(DEFAULTS.error('🍌')).to.eql(error);
    });

    it('create ← {paths} param variants', async () => {
      const { factory, dispose } = await setup();
      const paths: t.CmdPaths = {
        name: ['a'],
        params: ['x', 'p'],
        counter: ['x', 'n'],
        error: ['x', 'e'],
        tx: ['x', 'tx'],
      };

      const doc1 = await factory();
      const doc2 = await factory();
      const doc3 = await factory();

      const cmd1 = Cmd.create<C>(doc1);
      const cmd2 = Cmd.create<C>(doc2, { paths });
      const cmd3 = Cmd.create<C>(doc3, paths);

      const tx = 'tx.foo';
      const e = DEFAULTS.error('404');
      cmd1.invoke('Foo', { foo: 888 }, tx);
      cmd2.invoke('Bar', {}, { tx, error: e }); // NB: as full {options} object.
      cmd3.invoke('Bar', { msg: '👋' }, tx);

      await Time.wait(0);
      expect(doc1.current).to.eql({
        name: 'Foo',
        params: { foo: 888 },
        counter: { value: 1 },
        tx,
      });
      expect(doc2.current).to.eql({ a: 'Bar', x: { p: {}, n: { value: 1 }, tx, e } });
      expect(doc3.current).to.eql({ a: 'Bar', x: { p: { msg: '👋' }, n: { value: 1 }, tx } });

      dispose();
    });

    it('has initial {cmd} structure upon creation', async () => {
      const { doc, dispose } = await setup();
      expect(Cmd.Is.validState(doc.current)).to.eql(false);

      Cmd.create(doc);
      expect(Cmd.Is.validState(doc.current)).to.eql(true);

      dispose();
    });

    const length = 1000;
    it(`${length}x invocations - order retained`, async () => {
      const { doc, dispose, dispose$ } = await setup();
      const cmd = Cmd.create<C>(doc);

      const fired: t.CmdTx<C1>[] = [];
      cmd
        .events(dispose$)
        .on('Foo')
        .subscribe((e) => fired.push(e));

      Array.from({ length }).forEach((_, i) => cmd.invoke('Foo', { foo: i + 1 }));

      await Time.wait(0);
      expect(fired.length).to.eql(length);
      expect(fired[length - 1].params.foo).to.eql(length);
      expect(fired.map((e) => e.count)).to.eql(Array.from({ length }, (_, i) => i + 1));

      dispose();
    });

    describe('Cmd.transport (hidden field)', () => {
      it('retrieves doc', async () => {
        const { doc, dispose } = await setup();
        const cmd = Cmd.create<C>(doc);
        expect(Cmd.transport(cmd)).to.eql(doc);
        dispose();
      });

      it('throws', () => {
        const NON = [null, undefined, {}, [], true, 123, Symbol('foo'), BigInt(0)];
        NON.forEach((input) => {
          const fn = () => Cmd.transport(input);
          expect(fn).to.throw(/Input not a <Cmd>/);
        });
      });
    });
  });
}
