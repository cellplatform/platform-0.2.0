import { describe, it, expect, type t, A } from '../../test';
import { DEFAULTS, CmdBar } from '.';

describe('Cmd.Bar', () => {
  describe('Path (resolver)', () => {
    const resolver = CmdBar.Path.resolver;

    it('default paths', () => {
      const resolve = resolver(DEFAULTS.paths);
      const obj: t.CmdBarPathLens = {
        text: 'hello',
        invoked: new A.Counter(),
      };
      expect(resolve.text(obj)).to.eql('hello');
      expect(resolve.invoked(obj)).to.instanceOf(A.Counter);
    });

    it('custom paths', () => {
      const resolve = resolver({
        text: ['x', 'y', 'text'],
        invoked: ['z', 'foobar'],
      });
      const obj = {
        foo: { selected: 'abc', uri: 'def' },
        x: { y: { text: 'hello' } },
        z: { foobar: new A.Counter() },
      };
      expect(resolve.text(obj)).to.eql('hello');
      expect(resolve.invoked(obj)).to.instanceOf(A.Counter);
    });

    it('auto generates cmd.enter (counter)', () => {
      const resolve = resolver(DEFAULTS.paths);
      const obj1: t.CmdBarPathLens = {};
      const obj2: t.CmdBarPathLens = { invoked: new A.Counter() };
      expect(resolve.invoked(obj1)?.value).to.eql(0);
      expect(resolve.invoked(obj2)).to.equal(obj2.invoked); // NB: existing value.
    });
  });
});
