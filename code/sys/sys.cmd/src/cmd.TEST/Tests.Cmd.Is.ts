import { Cmd } from '..';
import { type t } from './common';
import type { C } from './t';

const Is = Cmd.Is;

export function flagTests(setup: t.CmdTestSetup, args: t.TestArgs) {
  const { describe, it, expect } = args;

  describe('Cmd.Is', () => {
    const NON = [null, undefined, 123, 'abc', {}, [], Symbol('foo'), BigInt(0)];

    it('Is.validState', () => {
      NON.forEach((v) => expect(Is.validState(v)).to.eql(false));
      expect(Is.validState({ name: '', params: {}, counter: { value: 0 }, tx: '' })).to.eql(true);
    });

    it('Is.cmd', async () => {
      const { dispose, doc } = await setup();
      const cmd = Cmd.create<C>(doc);
      NON.forEach((v) => expect(Is.cmd(v)).to.eql(false));
      expect(Is.cmd(cmd)).to.eql(true);
      dispose();
    });
  });
}
