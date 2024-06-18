import { Cmd, DEFAULTS } from '.';
import { R, Time, rx, type t } from './common';

export type C = C1 | C2;
export type C1 = t.CmdType<'Foo', { foo: number }>;
export type C2 = t.CmdType<'Bar', { msg?: string }>;

/**
 * Unit test factory for the <Cmd> system allowing different
 * kinds of source <ImmutableRef> and <Patch> types to be tested
 * against the same standard test suite.
 */
export async function commandTests(
  setup: t.CmdTestSetup,
  args: {
    describe: t.Describe;
    it: t.It;
    expect: t.Expect;
  },
) {
  const { describe, it, expect } = args;

  describe('Cmd', () => {
    it('Cmd.DEFAULTS', () => {
      expect(Cmd.DEFAULTS).to.eql(DEFAULTS);

      expect(DEFAULTS.counter()).to.eql({ value: 0 });
      expect(DEFAULTS.counter(123)).to.eql({ value: 123 });
      expect(DEFAULTS.counter()).to.not.equal(DEFAULTS.counter());

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
      expect(doc1.current).to.eql({ name: 'Foo', params: { foo: 888 }, counter: { value: 1 }, tx });
      expect(doc2.current).to.eql({ a: 'Bar', x: { p: {}, n: { value: 1 }, tx, e } });
      expect(doc3.current).to.eql({ a: 'Bar', x: { p: { msg: '👋' }, n: { value: 1 }, tx } });

      dispose();
    });

    it('has initial {cmd} structure upon creation', async () => {
      const { doc, dispose } = await setup();
      expect(Cmd.Is.initialized(doc.current)).to.eql(false);

      Cmd.create(doc);
      expect(Cmd.Is.initialized(doc.current)).to.eql(true);

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
        const tx = 'tx.foo';
        const obj: t.CmdPathsObject = { name, params, counter, tx };

        expect(resolve.name(obj)).to.eql(name);
        expect(resolve.params(obj, {})).to.eql(params);
        expect(resolve.counter(obj)).to.eql(counter);
        expect(resolve.tx(obj)).to.eql(tx);
        expect(resolve.toObject(obj)).to.eql({ count, name, params, tx });
      });

      it('custom paths', () => {
        const resolve = resolver({
          name: ['a'],
          params: ['x', 'y', 'p'],
          counter: ['z', 'n'],
          error: ['z', 'e'],
          tx: ['z', 'tx'],
        });
        const tx = 'tx.foo';
        const e = DEFAULTS.error('404');
        const n = DEFAULTS.counter();
        const r = { sum: 5 };
        const params: P = { foo: 123 };
        const name = 'foo.bar';
        const obj = {
          a: name,
          x: { y: { p: params }, r },
          z: { n, tx, e },
        };
        expect(resolve.name(obj)).to.eql(name);
        expect(resolve.params<P>(obj, { foo: 0 })).to.eql(params);
        expect(resolve.error(obj)).to.eql(e);
        expect(resolve.counter(obj)).to.eql(n);
        expect(resolve.tx(obj)).to.eql(tx);
        expect(resolve.toObject(obj)).to.eql({
          tx,
          count: n.value,
          name,
          params,
          error: e,
        });
      });

      it('.params ← generates new object', () => {
        const resolve = resolver(DEFAULTS.paths);
        const params: P = { foo: 0 };
        const obj1: t.CmdPathsObject<C> = {};
        const obj2: t.CmdPathsObject<C> = { params: { foo: 123 } };
        expect(resolve.params(obj1, params).foo).to.eql(0);
        expect(resolve.params(obj2, params).foo).to.eql(123);
      });

      it('.error', () => {
        const resolve = resolver(DEFAULTS.paths);

        type CustomError = t.Error & { type: 'BadDay' };
        const err1 = DEFAULTS.error('lulz');
        const err2: CustomError = { message: '😞', type: 'BadDay' };
        const obj1: t.CmdPathsObject<C> = {};
        const obj2: t.CmdPathsObject<C> = { error: err1 };

        expect(resolve.error({ ...obj1 })).to.eql(undefined);
        expect(resolve.error({ ...obj1 }, err2).type === 'BadDay').to.eql(true);
        expect(resolve.error({ ...obj2 }, err2).message).to.eql('lulz');

        const doc: t.CmdPathsObject = { name: 'foo', params: {}, error: err1 };
        expect(resolve.toObject(obj1).error).to.eql(undefined);
        expect(resolve.toObject(doc).error).to.eql(err1);
      });

      it('.count ← generates new object', () => {
        const resolve = resolver(DEFAULTS.paths);
        const counter = DEFAULTS.counter(10);
        const obj1: t.CmdPathsObject<C> = {};
        const obj2: t.CmdPathsObject<C> = { counter };
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
          error: ['foo', 'bar', 'error'],
          counter: ['foo', 'bar', 'counter'],
          tx: ['foo', 'bar', 'tx'],
        });
      });

      it('custom', () => {
        const input: t.CmdPaths = {
          name: ['a'],
          params: ['x', 'y', 'p'],
          error: ['x', 'e'],
          counter: ['z', 'n'],
          tx: ['z', 'tx'],
        };
        const res = Path.prepend(input, ['foo']);
        expect(res).to.eql({
          name: ['foo', 'a'],
          params: ['foo', 'x', 'y', 'p'],
          error: ['foo', 'x', 'e'],
          counter: ['foo', 'z', 'n'],
          tx: ['foo', 'z', 'tx'],
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
            counter: ['z', 'n'],
            tx: ['abc', 'tx'],
          }),
        ).to.eql(true);
        expect(
          Path.is.commandPaths({
            name: ['a'],
            params: ['x', 'y', 'p'],
            counter: ['z', 'n'],
            tx: ['abc', 'tx'],
          }),
        ).to.eql(true);
      });
    });
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
        const { doc, dispose } = await setup();
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

    const txType: t.CmdTxEvent['type'] = 'crdt:cmd/tx';
    describe(`event: "${txType}"`, () => {
      it('⚡️← on root {doc}', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd1 = Cmd.create<C>(doc);
        const cmd2 = Cmd.create<C2>(doc);
        const events = cmd1.events(dispose$);

        const fired: t.CmdEvent[] = [];
        const firedInvoked: t.CmdTx[] = [];
        events.$.subscribe((e) => fired.push(e));
        events.tx$.subscribe((e) => firedInvoked.push(e));

        const tx = 'tx.foo';
        cmd1.invoke('Foo', { foo: 0 }, { tx });
        cmd1.invoke('Bar', {}, { tx });
        cmd2.invoke('Bar', { msg: 'hello' }, { tx }); // NB: narrow type scoped at creation (no "Foo" command).

        await Time.wait(0);
        expect(fired.length).to.eql(3);
        expect(firedInvoked.length).to.eql(3);
        expect(fired.map((e) => e.payload)).to.eql(firedInvoked);

        const counts = firedInvoked.map((e) => e.count);
        expect(counts).to.eql([1, 2, 3]);
        expect(firedInvoked.map((e) => e.name)).to.eql(['Foo', 'Bar', 'Bar']);

        expect(firedInvoked[0].params).to.eql({ foo: 0 });
        expect(firedInvoked[1].params).to.eql({});
        expect(firedInvoked[2].params).to.eql({ msg: 'hello' });

        expect(doc.current).to.eql({
          tx,
          name: 'Bar',
          params: { msg: 'hello' },
          counter: { value: counts[2] },
        });
        dispose();
      });

      it('⚡️← custom paths', async () => {
        const { doc, dispose, dispose$ } = await setup();

        const paths: t.CmdPaths = {
          name: ['a'],
          params: ['x', 'y', 'p'],
          error: ['z', 'e'],
          counter: ['z', 'n'],
          tx: ['z', 'tx'],
        };

        const tx = 'tx.foo';
        const p = { msg: 'hello' };
        const e = undefined;
        const cmd = Cmd.create<C>(doc, { paths });
        const fired: t.CmdTx[] = [];
        cmd.events(dispose$).tx$.subscribe((e) => fired.push(e));
        cmd.invoke('Bar', p, { tx });

        await Time.wait(0);
        const count = fired[0].count;
        expect(fired.length).to.eql(1);
        expect(doc.current).to.eql({
          a: 'Bar',
          z: { n: { value: count }, tx },
          x: { y: { p } },
        });
        dispose();
      });

      it('⚡️← unique tx (default)', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);

        const fired: t.CmdTx[] = [];
        cmd.events(dispose$).tx$.subscribe((e) => fired.push(e));

        cmd.invoke('Foo', { foo: 0 });
        cmd.invoke('Bar', {});
        cmd.invoke('Bar', {}, { tx: '' }); // NB: empty string → tx IS generated.

        await Time.wait(0);
        const txs = fired.map((e) => e.tx);

        expect(txs.length).to.eql(3);
        expect(txs.every((tx) => typeof tx === 'string')).to.eql(true);
        expect(txs.every((tx) => tx !== '')).to.eql(true);
        expect(R.uniq(txs).length).to.eql(txs.length);
        dispose();
      });

      it('⚡️← specified tx', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);

        const fired: t.CmdTx[] = [];
        cmd.events(dispose$).tx$.subscribe((e) => fired.push(e));

        const tx = 'tx.foo';
        cmd.invoke('Foo', { foo: 0 }, { tx });
        cmd.invoke('Foo', { foo: 1 }, { tx });

        await Time.wait(0);
        expect(fired.length).to.eql(2);
        expect(fired.every((e) => e.tx === tx)).to.eql(true);
        expect(fired[0].params).to.eql({ foo: 0 });
        expect(fired[1].params).to.eql({ foo: 1 });
        dispose();
      });

      it('⚡️← tx factory', async () => {
        const { doc, dispose, dispose$ } = await setup();

        let count = 0;
        const tx = () => {
          count++;
          return `👋.${count}`;
        };
        const cmd = Cmd.create<C>(doc, { tx });

        const fired: t.CmdTx[] = [];
        cmd.events(dispose$).tx$.subscribe((e) => fired.push(e));

        cmd.invoke('Bar', {});
        cmd.invoke('Bar', {});

        await Time.wait(0);
        expect(fired[0].tx).to.eql('👋.1');
        expect(fired[1].tx).to.eql('👋.2');
        dispose();
      });
    });

    describe('filter', () => {
      it('.name<T>( ⚡️) ', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);
        const events = cmd.events(dispose$);

        const fired: t.CmdTx[] = [];
        events.on('Foo').subscribe((e) => fired.push(e));

        cmd.invoke('Foo', { foo: 0 });
        cmd.invoke('Bar', {}); // NB: filtered out.

        await Time.wait(0);
        expect(fired.length).to.eql(1);
        expect(fired[0].name).to.eql('Foo');
        expect(fired[0].params).to.eql({ foo: 0 });

        dispose();
      });
    });
  });

  describe('Cmd.Is', () => {
    const Is = Cmd.Is;
    it('Is.initialized', () => {
      const NOT = [null, undefined, 123, 'abc', {}, [], Symbol('foo'), BigInt(0)];
      NOT.forEach((v) => expect(Is.initialized(v)).to.eql(false));
      expect(Is.initialized({ name: '', params: {}, counter: { value: 0 }, tx: '' })).to.eql(true);
    });
  });

  describe('Cmd → Response', () => {
    type P = { a: number; b: number };
    type R = { sum: number };
    type E = t.Error & { code: number; type: 'bounds' };
    type C = C1 | C2 | C3;
    type C1 = t.CmdType<'add', P, C2, E>;
    type C2 = t.CmdType<'add:res', R>;
    type C3 = t.CmdType<'foo', { msg?: string }>;
    const sum = ({ a, b }: P): R => ({ sum: a + b });

    describe('examples', () => {
      /**
       * This manual example shows the basics of call and response
       * using nothing but the {Cmd} primitives.
       *
       * The {Response} and {Listener} helpers are simply wrappers
       * around the observable pattern below to provide some strongly
       * typed developer ergonomics.
       */
      it('via manual event hookup', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);
        const events = cmd.events(dispose$);

        const responses: t.CmdTx<C2>[] = [];
        events.on('add').subscribe((e) => cmd.invoke('add:res', sum(e.params)));
        events.on('add:res').subscribe((e) => responses.push(e));

        cmd.invoke('add', { a: 2, b: 3 });
        await Time.wait(20);

        expect(responses[0].params.sum).to.eql(5);
        dispose();
      });
    });

    it('Response {object} → "tx" passing', async () => {
      const { doc, dispose } = await setup();
      const cmd = Cmd.create<C>(doc);

      const tx = 'tx.abc';
      const res1 = cmd.invoke('foo', {}, { tx });
      const res2 = cmd.invoke(['add', 'add:res'], { a: 1, b: 2 }, { tx });

      expect(typeof res1 === 'object').to.be.true;
      expect((res1 as any).listen).to.be.undefined;
      expect(typeof res2 === 'object').to.be.true;

      expect(res1.tx).to.eql(tx);
      expect(res2.tx).to.eql(tx);

      expect(res1.req.name === 'foo').to.be.true;
      expect(res1.req.params).to.eql({});

      expect(res2.req.name === 'add').to.be.true;
      expect(res2.req.params).to.eql({ a: 1, b: 2 });

      dispose();
    });

    describe('Response (listen)', () => {
      it('listen', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);
        const events = cmd.events(dispose$);
        events.on('add').subscribe((e) => cmd.invoke('add:res', sum(e.params), e.tx));

        const res = cmd.invoke(['add', 'add:res'], { a: 1, b: 2 });

        expect(res.tx).to.be.a.string;
        expect(res.req.name).to.eql('add');
        expect(res.req.params.a).to.eql(1);
        expect(res.req.params.b).to.eql(2);

        expect(res.status).to.eql('Pending');
        expect(res.result).to.eql(undefined);
        expect(res.disposed).to.eql(false);

        await Time.wait(10);

        expect(res.ok).to.eql(true);
        expect(res.status).to.eql('Complete');
        expect(res.result?.sum).to.eql(3);
        expect(res.disposed).to.eql(true);

        dispose();
      });

      it('listen → events.on("name", fn:<callback>)', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);
        cmd.events(dispose$).on('add', function (e) {
          cmd.invoke('add:res', sum(e.params), e.tx);
        });

        const res = cmd.invoke(['add', 'add:res'], { a: 2, b: 3 });
        await Time.wait(10);

        expect(res.result?.sum).to.eql(5);
        dispose();
      });

      it('listen → {promise}', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);
        cmd.events(dispose$).on('add', (e) => cmd.invoke('add:res', sum(e.params), e.tx));

        const res = cmd.invoke(['add', 'add:res'], { a: 2, b: 3 });
        expect(res.result).to.eql(undefined);

        const promise = await res.promise();
        expect(res.result?.sum).to.eql(5);
        expect(promise.result?.sum).to.eql(5);

        dispose();
      });

      it('listen ← timeout', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);
        cmd.events(dispose$).on('add', async (e) => {
          await Time.wait(20); // NB: response is issued after invokation has timed-out.
          cmd.invoke('add:res', sum(e.params), e.tx);
        });

        const timeout = 10;
        const res = cmd.invoke(['add', 'add:res'], { a: 1, b: 2 }, { timeout });
        expect(res.ok).to.eql(true);
        expect(res.status).to.eql('Pending');
        expect(res.disposed).to.eql(false);

        await Time.wait(50);

        expect(res.ok).to.eql(false);
        expect(res.status === 'Timeout').to.eql(true);
        expect(res.result).to.eql(undefined);
        expect(res.disposed).to.eql(true);

        dispose();
      });

      it('listen(ƒ) ← register callback: onComplete', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);

        const fired: t.CmdResponseHandlerArgs<C1>[] = [];
        const events = cmd.events(dispose$);
        events.on('add', (e) => cmd.invoke('add:res', sum(e.params), e.tx));

        // Handler passed to listener constructor.
        await cmd.invoke(['add', 'add:res'], { a: 1, b: 2 }, (e) => fired.push(e)).promise();

        expect(fired[0].result?.sum).to.eql(3);
        expect(fired[0].cmd).to.equal(cmd);

        // Handler added to {listener} object.
        await cmd
          .invoke(['add', 'add:res'], { a: 2, b: 3 })
          .onComplete((e) => {
            fired.push(e);
            expect(e.result?.sum).to.eql(5); // NB: result strongly typed.
          })
          .promise();

        expect(fired[1].result?.sum).to.eql(5);
        dispose();
      });

      it('listen(ƒ) ← register callback: onError', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);
        const events = cmd.events(dispose$);

        const error: E = { message: 'boo', code: 123, type: 'bounds' };
        const fired: t.CmdResponseHandlerArgs<C1>[] = [];
        events
          .on('add')
          .subscribe(({ tx, params }) => cmd.invoke('add:res', sum(params), { tx, error }));

        // Handler passed to listener constructor.
        await cmd
          .invoke(['add', 'add:res'], { a: 1, b: 2 })
          .onError((e) => fired.push(e))
          .promise();

        expect(fired.length).to.eql(1);
        expect(fired[0].error).to.eql(error);
        expect(fired[0].cmd).to.equal(cmd);

        await cmd
          .invoke(['add', 'add:res'], { a: 1, b: 2 }, { onError: (e) => fired.push(e) })
          .promise();

        expect(fired.length).to.eql(2);
        expect(fired[1].error).to.eql(error);

        // Example.
        cmd.invoke(['add', 'add:res'], { a: 1, b: 2 }, (e) => {
          e.error; /*  handle error */
          e.result; /* do something with result */
        });

        dispose();
      });

      it('listen ← dispose', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);

        const events = cmd.events(dispose$);
        events.on('add').subscribe(async (e) => {
          await Time.wait(10); // NB: response is issued after listener has disposed.
          cmd.invoke('add:res', sum(e.params), res1.tx);
          cmd.invoke('add:res', sum(e.params), res2.tx);
        });

        const params: P = { a: 1, b: 2 };
        const res1 = cmd.invoke(['add', 'add:res'], params);
        const res2 = cmd.invoke(['add', 'add:res'], params, { dispose$ });
        expect(res1.disposed).to.eql(false);
        expect(res2.disposed).to.eql(false);

        res1.dispose();
        dispose();
        expect(res1.disposed).to.eql(true);
        expect(res2.disposed).to.eql(true);

        expect(res1.ok).to.eql(true);
        expect(res2.ok).to.eql(true);

        expect(res1.result).to.eql(undefined);
        expect(res2.result).to.eql(undefined);
      });
    });

    describe('Response → Error', () => {
      it('with error (default)', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);
        const events = cmd.events(dispose$);

        const error = Cmd.DEFAULTS.error('lulz');
        events.on('add').subscribe(({ tx, params }) => {
          cmd.invoke('add:res', sum(params), { tx, error });
        });

        const res = cmd.invoke(['add', 'add:res'], { a: 1, b: 2 });
        await res.promise();

        expect(doc.current.error).to.eql(error);
        expect(res.error).to.eql(error);
        expect(res.ok).to.eql(false);
        expect(res.status === 'Error').to.eql(true);

        dispose();
      });

      it('with custom error', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);
        const events = cmd.events(dispose$);

        const error = { code: 123, type: 'bounds', message: 'boo' };
        events.on('add').subscribe(({ tx, params }) => {
          cmd.invoke('add:res', sum(params), { tx, error });
        });

        const res = cmd.invoke(['add', 'add:res'], { a: 1, b: 2 });
        await res.promise();

        expect(res.error?.code).to.eql(123);
        expect(res.error?.type).to.eql('bounds');
        expect(res.error?.message).to.eql('boo');
        expect(res.status === 'Error').to.eql(true);

        dispose();
      });
    });
  });
}
