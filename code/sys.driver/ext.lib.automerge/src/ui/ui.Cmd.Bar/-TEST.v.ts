import { CmdBar, DEFAULTS } from '.';
import { Store } from '../../crdt';
import { A, Args, Time, describe, expect, it, type t } from '../../test';

describe('Cmd.Bar', () => {
  describe('Path (resolver)', () => {
    const resolver = CmdBar.Path.resolver;

    it('default paths', () => {
      const resolve = resolver(DEFAULTS.paths);
      const text = 'foobar';
      const params: t.CmdBarInvokeParams = { text, parsed: Args.parse(text) };
      const tx = 'tx.foo';
      const obj: t.CmdBarLens = {
        text: 'hello',
        cmd: { counter: new A.Counter(3), name: 'Invoke', params, tx },
      };
      expect(resolve.text(obj)).to.eql('hello');
      expect(resolve.toObject(obj)).to.eql({
        text: 'hello',
        cmd: { name: 'Invoke', params, count: 3, tx },
      });
    });

    it('custom paths', () => {
      const paths: t.CmdBarPaths = {
        text: ['x', 'y', 'text'],
        cmd: {
          counter: ['z', 'foobar'],
          name: ['x', 'n'],
          params: ['z', 'p'],
          error: ['z', 'e'],
          tx: ['z', 'tx'],
        },
      };
      const resolve = resolver(paths);
      const tx = 'tx.foo';
      const params = { msg: 'hello' };
      const error = DEFAULTS.error('404');
      const doc = {
        x: { y: { text: 'hello' }, n: 'invoke' },
        z: { foobar: new A.Counter(123), p: params, tx, e: error },
      };
      expect(resolve.text(doc)).to.eql('hello');

      const obj = resolve.toObject(doc);
      expect(obj.text).to.eql('hello');
      expect(obj.cmd).to.eql({ name: 'invoke', params, error, count: 123, tx });
    });
  });

  describe('CmdBar.Events', () => {
    describe('lifecycle', () => {
      it('create', async () => {
        const { doc, dispose } = await testSetup();
        const events1 = CmdBar.events({ doc });
        const events2 = CmdBar.events({ instance: 'foo', doc });
        expect(events1.instance).to.eql('');
        expect(events2.instance).to.eql('foo');
        dispose();
      });

      it('dispose', async () => {
        const { doc, dispose, dispose$ } = await testSetup();
        const events1 = CmdBar.events({ doc });
        const events2 = CmdBar.events({ doc, dispose$ });

        expect(events1.disposed).to.eql(false);
        expect(events2.disposed).to.eql(false);

        events1.dispose();
        dispose();
        expect(events1.disposed).to.eql(true);
        expect(events2.disposed).to.eql(true);
      });
    });

    describe('fires', () => {
      it('⚡️TextChanged', async () => {
        const { doc, dispose, dispose$ } = await testSetup();
        const events = CmdBar.events({ doc, dispose$ });

        const fired: t.CmdBarText[] = [];
        events.text$.subscribe((e) => fired.push(e));

        doc.change((d) => (d.text = 'hello'));
        expect(fired.length).to.eql(1);
        expect(fired[0].text).to.eql('hello');

        dispose();
      });

      it('⚡️Invoked', async () => {
        const { doc, dispose, dispose$ } = await testSetup();
        const events = CmdBar.events({ doc, dispose$ });
        const cmd = CmdBar.cmd(doc);

        const fired: t.CmdBarTx[] = [];
        events.cmd.$.subscribe((e) => fired.push(e));

        const text = 'foo';
        const params: t.CmdBarInvokeParams = { text, parsed: Args.parse(text) };
        cmd.invoke('Invoke', params);

        await Time.wait(0);
        expect(fired.length).to.eql(1);
        expect(fired[0].name).to.eql('Invoke');
        expect(fired[0].params).to.eql(params);

        dispose();
      });
    });
  });
});

/**
 * Helpers
 */
async function testSetup() {
  const store = Store.init();
  const { dispose$ } = store;
  const doc = await store.doc.getOrCreate<t.CmdBarLens>((d) => d);
  const dispose = () => store.dispose();
  return { store, doc, dispose, dispose$ } as const;
}
