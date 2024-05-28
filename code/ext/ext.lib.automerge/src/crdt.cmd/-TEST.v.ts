import { Cmd, DEFAULTS } from '.';
import { Doc, Store } from '../crdt';
import { A, describe, expect, it, rx, type t } from '../test';

describe('crdt.cmd (Command)', () => {
  it('Cmd.DEFAULTS', () => {
    expect(Cmd.DEFAULTS).to.eql(DEFAULTS);
    expect(DEFAULTS.counter()).to.instanceOf(A.Counter);
  });

  describe('Cmd.Path', () => {
    const Path = Cmd.Path;

    describe('Path.resolver', () => {
      type P = { foo: number };
      type C = t.CmdType<'Foo', P>;
      const resolver = Path.resolver;

      it('default paths', () => {
        const resolve = resolver();
        expect(resolve.paths).to.eql(DEFAULTS.paths);

        const counter = DEFAULTS.counter();
        const count = counter.value;
        const name = 'foo.bar';
        const params: P = { foo: 0 };
        const obj: t.CmdLens = { counter, name, params };
        expect(resolve.counter(obj)).to.eql(counter);
        expect(resolve.name(obj)).to.eql(name);
        expect(resolve.params(obj, {})).to.eql(params);
        expect(resolve.toObject(obj)).to.eql({ count, name, params });
      });

      it('custom paths', () => {
        const resolve = resolver({
          name: ['a'],
          params: ['x', 'y', 'p'],
          counter: ['z', 'tx'],
        });
        const tx = DEFAULTS.counter();
        const params: P = { foo: 123 };
        const name = 'foo.bar';
        const obj = {
          a: name,
          x: { y: { p: params } },
          z: { tx },
        };
        expect(resolve.counter(obj)).to.eql(tx);
        expect(resolve.name(obj)).to.eql(name);
        expect(resolve.params<P>(obj, { foo: 0 })).to.eql(params);
        expect(resolve.toObject(obj)).to.eql({ count: tx.value, name, params });
      });

      it('.params: generates new object', () => {
        const resolve = resolver(DEFAULTS.paths);
        const params: P = { foo: 0 };
        const obj1: t.CmdLens<C> = {};
        const obj2: t.CmdLens<C> = { params: { foo: 123 } };
        expect(resolve.params(obj1, params).foo).to.eql(0);
        expect(resolve.params(obj2, params).foo).to.eql(123);
      });

      it('.count: generates new object', () => {
        const resolve = resolver(DEFAULTS.paths);
        const counter = DEFAULTS.counter(10);
        const obj1: t.CmdLens<C> = {};
        const obj2: t.CmdLens<C> = { counter };
        expect(resolve.counter(obj1).value).to.eql(0);
        expect(resolve.counter(obj2).value).to.eql(10);
      });
    });

    describe('Path.prepend', () => {
      it('defaults', () => {
        const res = Path.prepend(DEFAULTS.paths, ['foo', 'bar']);
        expect(res).to.eql({
          name: ['foo', 'bar', 'name'],
          params: ['foo', 'bar', 'params'],
          counter: ['foo', 'bar', 'counter'],
        });
      });

      it('custom', () => {
        const input: t.CmdPaths = { name: ['a'], params: ['x', 'y', 'p'], counter: ['z', 'tx'] };
        const res = Path.prepend(input, ['foo']);
        expect(res).to.eql({
          name: ['foo', 'a'],
          params: ['foo', 'x', 'y', 'p'],
          counter: ['foo', 'z', 'tx'],
        });
      });
    });

    describe('Path.is', () => {
      it('is.stringArray', () => {});

      it('is.commandPaths', () => {
        const NOT = [undefined, null, 123, true, {}, [], Symbol('foo'), BigInt(123), ''];
        NOT.forEach((value) => expect(Path.is.commandPaths(value)).to.eql(false));
        expect(Path.is.commandPaths({ counter: [123], name: ['hello'], params: [] })).to.eql(false);
        expect(Path.is.commandPaths(DEFAULTS.paths)).to.eql(true);
        expect(
          Path.is.commandPaths({
            name: ['a'],
            params: ['x', 'y', 'p'],
            counter: ['z', 'tx'],
          }),
        ).to.eql(true);
      });
    });
  });

  describe('Cmd', () => {
    type C = C1 | C2;
    type C1 = t.CmdType<'Foo', { foo: number }>;
    type C2 = t.CmdType<'Bar', { msg?: string }>;

    it('create ← {paths} param variants', async () => {
      const { factory, dispose } = await testSetup();
      const paths: t.CmdPaths = { name: ['a'], params: ['x', 'p'], counter: ['x', 'tx'] };

      const doc1 = await factory();
      const doc2 = await factory();
      const doc3 = await factory();

      const cmd1 = Cmd.create<C>(doc1);
      const cmd2 = Cmd.create<C>(doc2, { paths });
      const cmd3 = Cmd.create<C>(doc3, paths);

      cmd1.invoke('Foo', { foo: 888 });
      cmd2.invoke('Bar', {});
      cmd3.invoke('Bar', { msg: '👋' });

      expect(doc1.current).to.eql({ name: 'Foo', params: { foo: 888 }, counter: { value: 1 } });
      expect(doc2.current).to.eql({ a: 'Bar', x: { p: {}, tx: { value: 1 } } });
      expect(doc3.current).to.eql({ a: 'Bar', x: { p: { msg: '👋' }, tx: { value: 1 } } });

      dispose();
    });

    describe('Cmd.Events', () => {
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
          const { doc, dispose } = await testSetup();
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

      const tx: t.CmdBarTxEvent['type'] = 'crdt:cmdbar/Tx';
      describe(`event: "${tx}"`, () => {
        it('⚡️tx ← on root {doc}', async () => {
          const { doc, dispose, dispose$ } = await testSetup();
          const cmd1 = Cmd.create<C>(doc);
          const cmd2 = Cmd.create<C2>(doc);
          const events = cmd1.events(dispose$);

          const fired: t.CmdEvent[] = [];
          const firedTx: t.CmdTx[] = [];
          events.$.subscribe((e) => fired.push(e));
          events.tx$.subscribe((e) => firedTx.push(e));

          cmd1.invoke('Foo', { foo: 0 });
          cmd1.invoke('Bar', {});
          cmd2.invoke('Bar', { msg: 'hello' }); // NB: narrow type scoped at creation (no "Foo" command).

          expect(fired.length).to.eql(3);
          expect(firedTx.length).to.eql(3);
          expect(fired.map((e) => e.payload)).to.eql(firedTx);

          const counts = firedTx.map((e) => e.count);
          expect(counts).to.eql([1, 2, 3]);
          expect(firedTx.map((e) => e.name)).to.eql(['Foo', 'Bar', 'Bar']);

          expect(firedTx[0].params).to.eql({ foo: 0 });
          expect(firedTx[1].params).to.eql({});
          expect(firedTx[2].params).to.eql({ msg: 'hello' });

          expect(doc.current).to.eql({
            name: 'Bar',
            params: { msg: 'hello' },
            counter: { value: counts[2] },
          });
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

          expect(doc.current).to.eql({
            foo: {
              name: 'Bar',
              params: { msg: 'hello' },
              counter: { value: fired[0].count },
            },
          });
          dispose();
        });

        it('⚡️tx ← custom paths', async () => {
          const { doc, dispose, dispose$ } = await testSetup();

          const paths: t.CmdPaths = {
            name: ['a'],
            params: ['x', 'y', 'p'],
            counter: ['z', 'tx'],
          };

          const p = { msg: 'hello' };
          const cmd = Cmd.create<C>(doc, { paths });
          const fired: t.CmdTx[] = [];
          cmd.events(dispose$).tx$.subscribe((e) => fired.push(e));
          cmd.invoke('Bar', p);
          expect(fired.length).to.eql(1);

          const count = fired[0].count;
          expect(doc.current).to.eql({ z: { tx: { value: count } }, a: 'Bar', x: { y: { p } } });
          dispose();
        });
      });
    });

    const length = 1000;
    it(`rapid number of invocations (${length}x)`, async () => {
      const { doc, dispose, dispose$ } = await testSetup();
      const cmd = Cmd.create<C>(doc);

      const fired: t.CmdTx<C1>[] = [];
      cmd
        .events(dispose$)
        .tx$.pipe(rx.map((e) => e as t.CmdTx<C1>))
        .subscribe((e) => fired.push(e));

      Array.from({ length }).forEach((_, i) => cmd.invoke('Foo', { foo: i + 1 }));
      expect(fired.length).to.eql(length);
      expect(fired[length - 1].params.foo).to.eql(length);
      expect(fired.map((e) => e.count)).to.eql(Array.from({ length }, (_, i) => i + 1));

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
  const factory = store.doc.factory((d) => d);
  const doc = await factory();
  const dispose = () => store.dispose();
  return { store, doc, factory, dispose, dispose$ } as const;
}
