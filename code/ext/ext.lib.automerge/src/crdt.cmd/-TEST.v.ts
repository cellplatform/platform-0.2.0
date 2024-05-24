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

  describe('Cmd.Events', () => {
    type C = C1 | C2;
    type C1 = t.CmdTx<'Foo', { count: number }>;
    type C2 = t.CmdTx<'Bar', { msg?: string }>;

    it('event: cmd/tx ← on root {doc}', async () => {
      const { doc, dispose, dispose$ } = await testSetup();

      const cmd1 = Cmd.create<C>(doc);
      const cmd2 = Cmd.create<C2>(doc);
      const events = cmd1.events(dispose$);

      const fired: t.CmdEvent[] = [];
      events.$.subscribe((e) => fired.push(e));

      cmd1.fire('Foo', { count: 0 });
      cmd1.fire('Bar', {});
      cmd2.fire('Bar', { msg: 'hello' }); // NB: narrow type scoped at creation (no "Foo" command).

      const txs = fired.map((e) => e.payload.tx);
      expect(R.uniq(txs).length).to.eql(txs.length);
      expect(fired.length).to.eql(3);
      expect(fired.map((e) => e.payload.cmd)).to.eql(['Foo', 'Bar', 'Bar']);

      expect(fired[0].payload.params).to.eql({ count: 0 });
      expect(fired[1].payload.params).to.eql({});
      expect(fired[2].payload.params).to.eql({ msg: 'hello' });

      expect(doc.current).to.eql({ tx: txs[2], cmd: 'Bar', params: { msg: 'hello' } });
      dispose();
    });

    it('events: cmd/tx ← on lens', async () => {
      const { doc, dispose, dispose$ } = await testSetup();
      const lens = Doc.lens(doc, ['foo'], (d) => (d.foo = {}));
      expect(doc.current).to.eql({ foo: {} });

      const cmd = Cmd.create<C>(lens);
      const fired: t.CmdEvent[] = [];
      cmd.events(dispose$).$.subscribe((e) => fired.push(e));
      cmd.fire('Bar', { msg: 'hello' });
      expect(fired.length).to.eql(1);

      const tx = fired[0].payload.tx;
      expect(doc.current).to.eql({ foo: { tx, cmd: 'Bar', params: { msg: 'hello' } } });
      dispose();
    });

    it('events: cmd/tx ← custom paths', async () => {
      const { doc, dispose, dispose$ } = await testSetup();

      const paths: t.CmdPaths = {
        tx: ['z', 'tx'],
        cmd: ['a'],
        params: ['x', 'y', 'p'],
      };

      const cmd = Cmd.create<C>(doc, { paths });
      const fired: t.CmdEvent[] = [];
      const p = { msg: 'hello' };
      cmd.events(dispose$).$.subscribe((e) => fired.push(e));
      cmd.fire('Bar', p);
      expect(fired.length).to.eql(1);

      const tx = fired[0].payload.tx;
      expect(doc.current).to.eql({ z: { tx }, a: 'Bar', x: { y: { p } } });
      dispose();
    });

    it('disposes', () => {
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
