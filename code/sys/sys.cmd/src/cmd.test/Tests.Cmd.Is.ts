import { Cmd } from '..';
import { type t } from './common';

const Is = Cmd.Is;

export function flagTests(setup: t.CmdTestSetup, args: t.TestArgs) {
  const { describe, it, expect } = args;

  describe('Cmd.Is', () => {
    it('Is.initialized', () => {
      const NOT = [null, undefined, 123, 'abc', {}, [], Symbol('foo'), BigInt(0)];
      NOT.forEach((v) => expect(Is.initialized(v)).to.eql(false));
      expect(Is.initialized({ name: '', params: {}, counter: { value: 0 }, tx: '' })).to.eql(true);
    });
  });
}
