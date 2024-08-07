import { Cmd } from '..';
import { type t } from './common';

const DEFAULTS = Cmd.DEFAULTS;
const Path = Cmd.Path;

export function pathTests(setup: t.CmdTestSetup, args: t.TestArgs) {
  const { describe, it, expect } = args;

  describe('Cmd.Path', () => {
    describe('wrangle', () => {
      it('<undefined> (defaults)', () => {
        expect(Path.wrangle()).to.equal(DEFAULTS.paths);
        expect(Path.wrangle(undefined)).to.equal(DEFAULTS.paths);
        expect(Path.wrangle(null as any)).to.equal(DEFAULTS.paths);
      });

      it('{paths} object', () => {
        const custom: t.CmdPaths = {
          name: ['a'],
          params: ['x', 'y', 'p'],
          counter: ['z', 'n'],
          error: ['z', 'e'],
          tx: ['z', 'tx'],
          queue: ['z', 'q'],
        };
        expect(Path.wrangle(DEFAULTS.paths)).to.eql(DEFAULTS.paths);
        expect(Path.wrangle(custom)).to.eql(custom);
      });

      it('prefix [path]', () => {
        const prefix = ['foo', 'bar'];
        const res = Path.wrangle(prefix);
        expect(res).to.eql(Path.prepend(prefix));
      });
    });

    describe('Path.resolver', () => {
      type P = { foo: number };
      type C = t.CmdType<'Foo', P>;

      it('default paths', () => {
        const resolve = Path.resolver();
        expect(resolve.paths).to.eql(DEFAULTS.paths);

        const counter = DEFAULTS.counter.create();
        const count = counter.value;
        const name = 'foo.bar';
        const params: P = { foo: 0 };
        const tx = 'tx.foo';
        const obj: t.CmdPathsObject = { queue: [], name, params, counter, tx };

        expect(resolve.queue.list(obj)).to.eql([]);
        expect(resolve.name(obj)).to.eql(name);
        expect(resolve.params(obj, {})).to.eql(params);
        expect(resolve.counter(obj)).to.eql(counter);
        expect(resolve.tx(obj)).to.eql(tx);
        expect(resolve.toObject(obj)).to.eql({ queue: [], count, name, params, tx });
      });

      it('custom paths: {object}', () => {
        const resolve = Path.resolver({
          name: ['a'],
          params: ['x', 'y', 'p'],
          counter: ['z', 'n'],
          error: ['z', 'e'],
          tx: ['z', 'tx'],
          queue: ['z', 'q'],
        });
        const tx = 'tx.foo';
        const e = DEFAULTS.error('404');
        const n = DEFAULTS.counter.create();
        const r = { sum: 5 };
        const params: P = { foo: 123 };
        const name = 'foo.bar';
        const obj = {
          a: name,
          x: { y: { p: params }, r },
          z: { n, tx, e, q: [] },
        };
        expect(resolve.queue.list(obj)).to.eql([]);
        expect(resolve.name(obj)).to.eql(name);
        expect(resolve.params<P>(obj, { foo: 0 })).to.eql(params);
        expect(resolve.error(obj)).to.eql(e);
        expect(resolve.counter(obj)).to.eql(n);
        expect(resolve.tx(obj)).to.eql(tx);
        expect(resolve.toObject(obj)).to.eql({
          queue: [],
          tx,
          count: n.value,
          name,
          params,
          error: e,
        });
      });

      it('custom paths: [prepended]', () => {
        const resolve = Path.resolver(['foo', 'bar']);

        const counter = DEFAULTS.counter.create();
        const count = counter.value;
        const name = 'foo.bar';
        const params: P = { foo: 0 };
        const tx = 'tx.foo';
        const cmd: t.CmdPathsObject = { name, params, counter, tx, queue: [] };
        const obj = { foo: { bar: cmd } };

        expect(resolve.queue.list(obj)).to.eql(cmd.queue);
        expect(resolve.name(obj)).to.eql(name);
        expect(resolve.params(obj, {})).to.eql(params);
        expect(resolve.counter(obj)).to.eql(counter);
        expect(resolve.tx(obj)).to.eql(tx);
        expect(resolve.toObject(obj)).to.eql({ count, name, params, tx, queue: [] });
      });

      it('.params ← generates new object', () => {
        const resolve = Path.resolver(DEFAULTS.paths);
        const params: P = { foo: 0 };
        const obj1: t.CmdPathsObject<C> = {};
        const obj2: t.CmdPathsObject<C> = { params: { foo: 123 } };
        expect(resolve.params(obj1, params).foo).to.eql(0);
        expect(resolve.params(obj2, params).foo).to.eql(123);
      });

      it('.count ← generates new object', () => {
        const resolve = Path.resolver(DEFAULTS.paths);
        const counter = DEFAULTS.counter.create(10);
        const obj1: t.CmdPathsObject<C> = {};
        const obj2: t.CmdPathsObject<C> = { counter };
        expect(resolve.counter(obj1).value).to.eql(0);
        expect(resolve.counter(obj2).value).to.eql(10);
      });

      it('.queue.list ← generates new [array]', () => {
        const resolve = Path.resolver(DEFAULTS.paths);
        const obj1: t.CmdPathsObject<C> = {};
        const obj2: t.CmdPathsObject<C> = { queue: [] };
        expect(resolve.queue.list(obj1)).to.eql([]);
        expect(resolve.queue.list(obj2)).to.equal(obj2.queue); // NB: mutated (added).
      });

      describe('.queue.index(n)', () => {
        it('index <undefined> ← adds to end of list', () => {
          const resolve = Path.resolver();
          const obj: t.CmdPathsObject<C> = {};

          const res1 = resolve.queue.index(obj);
          const res2 = resolve.queue.index(obj);

          expect(res1.index).to.eql(0);
          expect(res2.index).to.eql(1);
          expect(obj.queue?.length).to.equal(2);

          expect(res1.path).to.eql(['queue', 0]);
          expect(res2.path).to.eql(['queue', 1]);
        });

        it('index specified ← retrieves existing', () => {
          const resolve = Path.resolver();
          const obj: t.CmdPathsObject<C> = {};

          resolve.queue.index(obj);
          resolve.queue.index(obj);
          const item = obj.queue?.[1];
          resolve.queue.index(obj, 1); // NB: retrieve existing.

          expect(obj.queue).to.eql([{}, {}]); // NB: blank item upon first request.
          expect(obj.queue?.[1]).to.equal(item); // NB: same instance (not clobbered).
        });

        it('index.name', () => {
          const resolve = Path.resolver();
          const obj: t.CmdPathsObject<C> = {};
          const res1 = resolve.queue.index(obj);
          const res2 = resolve.queue.index(obj);

          expect(res1.name()).to.eql('');
          expect(res2.name('foo')).to.eql('foo');
          expect(obj.queue?.[0].name).to.equal('');
          expect(obj.queue?.[1].name).to.equal('foo');
        });

        it('index.params', () => {
          const resolve = Path.resolver();
          const obj: t.CmdPathsObject<C> = {};
          const res1 = resolve.queue.index(obj);
          const res2 = resolve.queue.index(obj);
          const params = { foo: 123 };

          expect(res1.params({})).to.eql({});
          expect(res2.params(params)).to.eql(params);
          expect(obj.queue?.[0].params).to.eql({});
          expect(obj.queue?.[1].params).to.eql(params);
        });

        it('index.error', () => {
          const resolve = Path.resolver();
          const obj: t.CmdPathsObject<C> = {};
          const res1 = resolve.queue.index(obj);
          const res2 = resolve.queue.index(obj);
          const error = { msg: '🐷' };

          expect(res1.error({})).to.eql({});
          expect(res2.error(error)).to.eql(error);
          expect(obj.queue?.[0].error).to.eql({});
          expect(obj.queue?.[1].error).to.eql(error);
        });

        it('index.tx', () => {
          const resolve = Path.resolver();
          const obj: t.CmdPathsObject<C> = {};
          const res1 = resolve.queue.index(obj);
          const res2 = resolve.queue.index(obj);

          expect(res1.tx()).to.be.string;
          expect(res2.tx('my.tx')).to.eql('my.tx');
          expect(obj.queue?.[0].tx).to.eql(res1.tx());
          expect(obj.queue?.[1].tx).to.eql('my.tx');
        });
      });
    });

    describe('Path.prepend', () => {
      it('defaults', () => {
        const test = (paths?: t.CmdPaths) => {
          const res = Path.prepend(['foo', 'bar'], paths);
          expect(res).to.eql({
            name: ['foo', 'bar', 'name'],
            params: ['foo', 'bar', 'params'],
            error: ['foo', 'bar', 'error'],
            counter: ['foo', 'bar', 'counter'],
            tx: ['foo', 'bar', 'tx'],
            queue: ['foo', 'bar', 'queue'],
          });
        };

        test();
        test(DEFAULTS.paths);
      });

      it('custom', () => {
        const input: t.CmdPaths = {
          name: ['a'],
          params: ['x', 'y', 'p'],
          error: ['x', 'e'],
          counter: ['z', 'n'],
          tx: ['z', 'tx'],
          queue: ['z', 'q'],
        };
        const res = Path.prepend(['foo'], input);
        expect(res).to.eql({
          name: ['foo', 'a'],
          params: ['foo', 'x', 'y', 'p'],
          error: ['foo', 'x', 'e'],
          counter: ['foo', 'z', 'n'],
          tx: ['foo', 'z', 'tx'],
          queue: ['foo', 'z', 'q'],
        });
      });
    });

    describe('Path.is', () => {
      it('is.stringArray', () => {});

      it('is.commandPaths', () => {
        const NOT = [undefined, null, 123, true, {}, [], Symbol('foo'), BigInt(123), ''];
        NOT.forEach((value) => expect(Path.Is.commandPaths(value)).to.eql(false));
        expect(Path.Is.commandPaths({ counter: [123], name: ['hello'], params: [] })).to.eql(false);

        expect(Path.Is.commandPaths(DEFAULTS.paths)).to.eql(true);
        expect(
          Path.Is.commandPaths({
            name: ['a'],
            params: ['x', 'y', 'p'],
            counter: ['z', 'n'],
            tx: ['abc', 'tx'],
          }),
        ).to.eql(true);
        expect(
          Path.Is.commandPaths({
            name: ['a'],
            params: ['x', 'y', 'p'],
            counter: ['z', 'n'],
            tx: ['abc', 'tx'],
          }),
        ).to.eql(true);
      });
    });
  });
}
