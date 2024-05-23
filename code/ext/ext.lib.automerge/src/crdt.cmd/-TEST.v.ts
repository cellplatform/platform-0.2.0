import { describe, it, expect, type t } from '../test';
import { Cmd, DEFAULTS } from '.';

describe('crdt.cmd (Command)', () => {
  it('DEFAULTS', () => {
    expect(Cmd.DEFAULTS).to.eql(DEFAULTS);
  });

  describe('Path', () => {
    describe('Path.resolver', () => {
      type P = { count: number };
      const resolver = Cmd.Path.resolver;

      it('default paths', () => {
        const resolve = resolver();
        expect(resolve.paths).to.eql(DEFAULTS.paths);

        const tx = 'tx.123';
        const params: P = { count: 0 };
        const obj: t.CmdLens = { tx, params };
        expect(resolve.tx(obj)).to.eql(tx);
        expect(resolve.params(obj, {})).to.eql(params);
        expect(resolve.toDoc(obj)).to.eql({ tx, params });
      });

      it('custom paths', () => {
        const resolve = resolver({
          tx: ['z', 'tx'],
          params: ['x', 'y', 'p'],
        });
        const params: P = { count: 123 };
        const tx = 'tx.123';
        const obj = {
          x: { y: { p: params } },
          z: { tx },
        };
        expect(resolve.tx(obj)).to.eql(tx);
        expect(resolve.params<P>(obj, { count: 0 })).to.eql(params);
        expect(resolve.toDoc(obj)).to.eql({ tx, params });
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
});
