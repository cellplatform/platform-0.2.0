import { Doc, Store } from '..';
import { Cmd, Time, describe, expect, it, type t } from '../../test';

import { Tests } from 'sys.cmd';
import type { C } from 'sys.cmd/src/test/t';

const setup: t.CmdTestSetup = async () => {
  const store = Store.init();
  const { dispose$ } = store;
  const dispose = () => store.dispose();
  const factory: t.CmdTestFactory = () => store.doc.getOrCreate((d) => d);
  const res: t.CmdTestState = { doc: await factory(), factory, dispose, dispose$ };
  return res;
};

describe('crdt.cmd (Command)', () => {
  /**
   * Standardised test suite for the <Cmd> system.
   */
  Tests.all(setup, { describe, it, expect });

  /**
   * CRDT/Lens specific tests.
   */
  describe('Lens (Command)', () => {
    it('has initial {cmd} structure upon creation', async () => {
      const { doc, dispose } = await setup();
      const lens = Doc.lens(doc as t.Doc, ['foo', 'bar'], (d) => (d.foo = { bar: {} }));

      expect(Cmd.Is.validState(doc.current)).to.eql(false);
      expect(Cmd.Is.validState(lens.current)).to.eql(false);

      Cmd.create(doc);
      expect(Cmd.Is.validState(doc.current)).to.eql(true);
      expect(Cmd.Is.validState(lens.current)).to.eql(false);

      Cmd.create(lens);

      expect(Cmd.Is.validState(lens.current)).to.eql(true);
      expect(Cmd.Is.validState((doc.current as any).foo.bar)).to.eql(true);

      dispose();
    });

    it('⚡️← on lens', async () => {
      const { doc, dispose, dispose$ } = await setup();
      const lens = Doc.lens(doc as t.Doc, ['foo'], (d) => (d.foo = {}));
      expect(doc.current).to.eql({ foo: {} });

      const cmd = Cmd.create<C>(lens);
      const fired: t.CmdTx[] = [];
      cmd.events(dispose$).tx$.subscribe((e) => fired.push(e));

      const tx = 'tx.foo';
      cmd.invoke('Bar', { msg: 'hello' }, { tx });

      await Time.wait(0);
      expect(fired.length).to.eql(1);
      expect(doc.current).to.eql({
        foo: {
          name: 'Bar',
          params: { msg: 'hello' },
          counter: { value: fired[0].count },
          tx,
        },
      });
      dispose();
    });
  });
});
