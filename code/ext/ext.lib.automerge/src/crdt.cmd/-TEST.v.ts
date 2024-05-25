import { Cmd, DEFAULTS } from '.';
import { Doc, Store } from '../crdt';
import { R, describe, expect, it, rx, type t } from '../test';

describe('crdt.cmd (Command)', () => {
  it('Cmd.DEFAULTS', () => {
    expect(Cmd.DEFAULTS).to.eql(DEFAULTS);
  });

  describe('Cmd.Path', () => {
    describe('Path.resolver', () => {
      type P = { count: number };
      const resolver = Cmd.Path.resolver;

      it('default paths', () => {
        const resolve = resolver();
        expect(resolve.paths).to.eql(DEFAULTS.paths);

        const tx = 'tx.123';
        const cmd = 'foo.bar';
        const params: P = { count: 0 };
        const obj: t.CmdLens = { tx, cmd: cmd, params };
        expect(resolve.tx(obj)).to.eql(tx);
        expect(resolve.cmd(obj)).to.eql(cmd);
        expect(resolve.params(obj, {})).to.eql(params);
        expect(resolve.toDoc(obj)).to.eql({ tx, cmd, params });
      });

      it('custom paths', () => {
        const resolve = resolver({
          tx: ['z', 'tx'],
          cmd: ['a'],
          params: ['x', 'y', 'p'],
        });
        const tx = 'tx.123';
        const params: P = { count: 123 };
        const cmd = 'foo.bar';
        const obj = {
          a: cmd,
          x: { y: { p: params } },
          z: { tx },
        };
        expect(resolve.tx(obj)).to.eql(tx);
        expect(resolve.cmd(obj)).to.eql(cmd);
        expect(resolve.params<P>(obj, { count: 0 })).to.eql(params);
        expect(resolve.toDoc(obj)).to.eql({ tx, cmd, params });
      });

      it('.params: generates new object', () => {
        const resolve = resolver(DEFAULTS.paths);
        const params: P = { count: 0 };
        const obj1: t.CmdLens<P> = {};
        const obj2: t.CmdLens<P> = { params: { count: 123 } };
        expect(resolve.params(obj1, params).count).to.eql(0);
        expect(resolve.params(obj2, params).count).to.eql(123);
      });
    });
  });

  describe('Cmd | Cmd.Events', () => {
    type C = C1 | C2;
    type C1 = t.CmdTx<'Foo', { count: number }>;
    type C2 = t.CmdTx<'Bar', { msg?: string }>;

    describe('lifecycle', () => {
      it('Cmd.Events.create → dispose', () => {
        const life = rx.disposable();
        const { dispose$ } = life;
        const events1 = Cmd.Events.create(undefined, {});
        const events2 = Cmd.Events.create(undefined, { dispose$ });
        expect(events1.disposed).to.eql(false);
        expect(events2.disposed).to.eql(false);

        events1.dispose();
        life.dispose();
        expect(events1.disposed).to.eql(true);
        expect(events2.disposed).to.eql(true);
      });

      it('cmd.events() → dispose', async () => {
        const { doc, dispose, dispose$ } = await testSetup();
        const life = rx.disposable();

        const cmd = Cmd.create<C>(doc);
        const events1 = cmd.events();
        const events2 = cmd.events(life.dispose$);
        expect(events1.disposed).to.eql(false);
        expect(events2.disposed).to.eql(false);

        events1.dispose();
        expect(events1.disposed).to.eql(true);
        expect(events2.disposed).to.eql(false);

        life.dispose();
        expect(events1.disposed).to.eql(true);
        expect(events2.disposed).to.eql(true);

        dispose();
      });
    });

    const typenameTx: t.CmdBarTxEvent['type'] = 'crdt:cmdbar/Tx';
    describe(`event: "${typenameTx}"`, () => {
      it('⚡️tx ← on root {doc}', async () => {
        const { doc, dispose, dispose$ } = await testSetup();
        const cmd1 = Cmd.create<C>(doc);
        const cmd2 = Cmd.create<C2>(doc);
        const events = cmd1.events(dispose$);

        const fired: t.CmdEvent[] = [];
        const firedTx: t.CmdTx[] = [];
        events.$.subscribe((e) => fired.push(e));
        events.tx$.subscribe((e) => firedTx.push(e));

        cmd1.invoke('Foo', { count: 0 });
        cmd1.invoke('Bar', {});
        cmd2.invoke('Bar', { msg: 'hello' }); // NB: narrow type scoped at creation (no "Foo" command).

        expect(fired.length).to.eql(3);
        expect(firedTx.length).to.eql(3);
        expect(fired.map((e) => e.payload)).to.eql(firedTx);

        const txs = firedTx.map((e) => e.tx);
        expect(R.uniq(txs).length).to.eql(txs.length);
        expect(firedTx.map((e) => e.cmd)).to.eql(['Foo', 'Bar', 'Bar']);

        expect(firedTx[0].params).to.eql({ count: 0 });
        expect(firedTx[1].params).to.eql({});
        expect(firedTx[2].params).to.eql({ msg: 'hello' });

        expect(doc.current).to.eql({ tx: txs[2], cmd: 'Bar', params: { msg: 'hello' } });
        dispose();
      });

      it('⚡️tx ← on lens', async () => {
        const { doc, dispose, dispose$ } = await testSetup();
        const lens = Doc.lens(doc, ['foo'], (d) => (d.foo = {}));
        expect(doc.current).to.eql({ foo: {} });

        const cmd = Cmd.create<C>(lens);
        const fired: t.CmdTx[] = [];
        cmd.events(dispose$).tx$.subscribe((e) => fired.push(e));
        cmd.invoke('Bar', { msg: 'hello' });
        expect(fired.length).to.eql(1);

        const tx = fired[0].tx;
        expect(doc.current).to.eql({ foo: { tx, cmd: 'Bar', params: { msg: 'hello' } } });
        dispose();
      });

      it('⚡️tx ← custom paths', async () => {
        const { doc, dispose, dispose$ } = await testSetup();

        const paths: t.CmdPaths = {
          tx: ['z', 'tx'],
          cmd: ['a'],
          params: ['x', 'y', 'p'],
        };

        const p = { msg: 'hello' };
        const cmd = Cmd.create<C>(doc, { paths });
        const fired: t.CmdTx[] = [];
        cmd.events(dispose$).tx$.subscribe((e) => fired.push(e));
        cmd.invoke('Bar', p);
        expect(fired.length).to.eql(1);

        const tx = fired[0].tx;
        expect(doc.current).to.eql({ z: { tx }, a: 'Bar', x: { y: { p } } });
        dispose();
      });
    });

    it('rapid number of invocations', async () => {
      const { doc, dispose, dispose$ } = await testSetup();
      const cmd = Cmd.create<C>(doc);

      const fired: t.CmdTx[] = [];
      cmd.events(dispose$).tx$.subscribe((e) => fired.push(e));

      const length = 1000;
      Array.from({ length }).forEach((_, i) => cmd.invoke('Foo', { count: i + 1 }));

      expect(fired.length).to.eql(length);
      expect(fired[length - 1].params.count).to.eql(length);
      dispose();
    });
  });
});

/**
 * Helpers
 */
async function testSetup() {
  const store = Store.init();
  const { dispose$ } = store;
  const doc = await store.doc.getOrCreate((d) => d);
  const dispose = () => store.dispose();
  return { store, doc, dispose, dispose$ } as const;
}
