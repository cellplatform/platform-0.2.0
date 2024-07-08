import { Cmd } from '..';
import { type t } from './common';

const DEFAULTS = Cmd.DEFAULTS;
const Path = Cmd.Path;

export function pathTests(setup: t.CmdTestSetup, args: t.TestArgs) {
  const { describe, it, expect } = args;

  describe('Cmd.Path', () => {
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
        const obj: t.CmdPathsObject = { name, params, counter, tx };

        expect(resolve.name(obj)).to.eql(name);
        expect(resolve.params(obj, {})).to.eql(params);
        expect(resolve.counter(obj)).to.eql(counter);
        expect(resolve.tx(obj)).to.eql(tx);
        expect(resolve.toObject(obj)).to.eql({ count, name, params, tx });
      });

      it('custom paths', () => {
        const resolve = Path.resolver({
          name: ['a'],
          params: ['x', 'y', 'p'],
          counter: ['z', 'n'],
          error: ['z', 'e'],
          tx: ['z', 'tx'],
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
        const resolve = Path.resolver(DEFAULTS.paths);
        const params: P = { foo: 0 };
        const obj1: t.CmdPathsObject<C> = {};
        const obj2: t.CmdPathsObject<C> = { params: { foo: 123 } };
        expect(resolve.params(obj1, params).foo).to.eql(0);
        expect(resolve.params(obj2, params).foo).to.eql(123);
      });

      it('.error', () => {
        const resolve = Path.resolver(DEFAULTS.paths);

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
        const resolve = Path.resolver(DEFAULTS.paths);
        const counter = DEFAULTS.counter.create(10);
        const obj1: t.CmdPathsObject<C> = {};
        const obj2: t.CmdPathsObject<C> = { counter };
        expect(resolve.counter(obj1).value).to.eql(0);
        expect(resolve.counter(obj2).value).to.eql(10);
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
        };
        const res = Path.prepend(['foo'], input);
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
}
