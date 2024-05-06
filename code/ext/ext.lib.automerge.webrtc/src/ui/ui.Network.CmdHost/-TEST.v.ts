import { DEFAULTS, NetworkCmdHost } from '.';
import { A, describe, expect, it, type t } from '../../test';

describe('CmdHost', () => {
  describe('Path (resolver)', () => {
    const resolver = NetworkCmdHost.Path.resolver;

    it('default paths', () => {
      const resolve = resolver(DEFAULTS.paths);
      const obj: t.CmdHostPathLens = {
        uri: { loaded: 'def', selected: 'abc' },
        cmd: { text: 'hello', enter: new A.Counter() },
      };
      expect(resolve.uri.selected(obj)).to.eql('abc');
      expect(resolve.uri.loaded(obj)).to.eql('def');
      expect(resolve.cmd.text(obj)).to.eql('hello');
      expect(resolve.cmd.enter(obj)).to.instanceOf(A.Counter);
    });

    it('custom paths', () => {
      const resolve = resolver({
        uri: { loaded: ['foo', 'uri'], selected: ['foo', 'selected'] },
        cmd: { text: ['x', 'y', 'text'], enter: ['z', 'enterKey'] },
      });
      const obj = {
        foo: { selected: 'abc', uri: 'def' },
        x: { y: { text: 'hello' } },
        z: { enterKey: new A.Counter() },
      };
      expect(resolve.uri.selected(obj)).to.eql('abc');
      expect(resolve.uri.loaded(obj)).to.eql('def');
      expect(resolve.cmd.text(obj)).to.eql('hello');
      expect(resolve.cmd.enter(obj)).to.instanceOf(A.Counter);
    });

    it('auto generates cmd.enter (counter)', () => {
      const resolve = resolver(DEFAULTS.paths);
      const obj1: t.CmdHostPathLens = {};
      const obj2: t.CmdHostPathLens = { cmd: { enter: new A.Counter() } };
      expect(resolve.cmd.enter(obj1)?.value).to.eql(0);
      expect(resolve.cmd.enter(obj2)).to.equal(obj2.cmd?.enter); // NB: existing value.
    });
  });
});
