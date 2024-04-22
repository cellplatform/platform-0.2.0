import { DEFAULTS, NetworkCmdHost } from '.';
import { describe, expect, it, type t } from '../../test';

describe('CmdHost', () => {
  describe('Path (resolver)', () => {
    const resolver = NetworkCmdHost.Path.resolver;

    it('default paths', () => {
      const resolve = resolver(DEFAULTS.paths);
      const obj: t.CmdHostPathLens = {
        uri: { loaded: 'def', selected: 'abc' },
        cmd: { text: 'hello' },
      };
      expect(resolve.cmd.text(obj)).to.eql('hello');
      expect(resolve.uri.selected(obj)).to.eql('abc');
      expect(resolve.uri.loaded(obj)).to.eql('def');
    });

    it('custom paths', () => {
      const resolve = resolver({
        uri: { loaded: ['foo', 'uri'], selected: ['foo', 'selected'] },
        cmd: { text: ['x', 'y', 'text'] },
      });
      const obj = {
        foo: { selected: 'abc', uri: 'def' },
        x: { y: { text: 'hello' } },
      };
      expect(resolve.cmd.text(obj)).to.eql('hello');
      expect(resolve.uri.selected(obj)).to.eql('abc');
      expect(resolve.uri.loaded(obj)).to.eql('def');
    });
  });
});
