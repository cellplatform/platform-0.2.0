import { Cmd } from '..';
import { R, Time, rx, type t } from './common';
import type { C, C1, C2 } from './t';

export function eventTests(setup: t.CmdTestSetup, args: t.TestArgs) {
  const { describe, it, expect } = args;

  describe('Cmd.Events', () => {
    describe('lifecycle', () => {
      it('Cmd.Events.create → dispose', () => {
        const life = rx.disposable();
        const { dispose$ } = life;
        const events1 = Cmd.Events.create(undefined, {});
        const events2 = Cmd.Events.create(undefined, { dispose$ });
        expect(events1.disposed).to.eql(false);
        expect(events2.disposed).to.eql(false);

        events1.dispose();
        life.dispose();
        expect(events1.disposed).to.eql(true);
        expect(events2.disposed).to.eql(true);
      });

      describe('dispose', () => {
        it('cmd.events() → dispose', async () => {
          const { doc, dispose } = await setup();
          const life = rx.disposable();

          const cmd = Cmd.create<C>(doc);
          const events1 = cmd.events();
          const events2 = cmd.events(life.dispose$);
          expect(events1.disposed).to.eql(false);
          expect(events2.disposed).to.eql(false);

          events1.dispose();
          expect(events1.disposed).to.eql(true);
          expect(events2.disposed).to.eql(false);

          life.dispose();
          expect(events1.disposed).to.eql(true);
          expect(events2.disposed).to.eql(true);

          dispose();
        });

        it('continues to fire after non-related events dispose', async () => {
          const { doc, dispose } = await setup();

          const cmd = Cmd.create<C>(doc);
          const method = cmd.method('Foo');
          const events1 = cmd.events(undefined);
          const events2 = cmd.events(undefined);

          let fired1 = 0;
          let fired2 = 0;
          events1.on('Foo', () => fired1++);
          events2.on('Foo', () => fired2++);

          method({ foo: 123 });
          await Time.wait(0);
          expect(fired1).to.eql(1);
          expect(fired2).to.eql(1);

          events1.dispose();
          expect(events1.disposed).to.eql(true);
          expect(events2.disposed).to.eql(false); // NB: not disposed, and still continues to fire.

          method({ foo: 456 });
          await Time.wait(0);
          expect(fired1).to.eql(1);
          expect(fired2).to.eql(2);

          dispose();
        });

        it('does not dispose of injected subject$', async () => {
          const { doc, dispose } = await setup();
          const life = rx.lifecycle();
          const subject$ = rx.subject();

          const cmd = Cmd.create<C>(doc);
          const events1 = cmd.events(life.dispose$);
          const events2 = cmd.events(subject$);

          expect(life.disposed).to.eql(false);
          expect(events1.disposed).to.eql(false);
          expect(events2.disposed).to.eql(false);
          expect(subject$.closed).to.eql(false);

          events1.dispose();
          events2.dispose();
          expect(events1.disposed).to.eql(true);
          expect(events2.disposed).to.eql(true);

          // NB: the injected dispose$ observables were not triggered.
          expect(life.disposed).to.eql(false);
          expect(subject$.closed).to.eql(false);

          dispose();
        });
      });
    });

    const txType: t.CmdTxEvent['type'] = 'sys.cmd/tx';
    describe(`event: "${txType}"`, () => {
      it('⚡️← on root {doc}', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd1 = Cmd.create<C>(doc);
        const cmd2 = Cmd.create<C2>(doc);
        const events = cmd1.events(dispose$);

        const fired: t.CmdEvent[] = [];
        const invoked: t.CmdTx[] = [];
        events.$.subscribe((e) => fired.push(e));
        events.tx$.subscribe((e) => invoked.push(e));

        const tx = 'tx.foo';
        cmd1.invoke('Foo', { foo: 0 }, { tx });
        cmd1.invoke('Bar', {}, { tx });
        cmd2.invoke('Bar', { msg: 'hello' }, { tx }); // NB: narrow type scoped at creation (no "Foo" command).

        await Time.wait(0);
        expect(fired.length).to.eql(3);
        expect(invoked.length).to.eql(3);
        expect(fired.map((e) => e.payload)).to.eql(invoked);

        expect(invoked.map((e) => e.name)).to.eql(['Foo', 'Bar', 'Bar']);

        expect(invoked[0].params).to.eql({ foo: 0 });
        expect(invoked[1].params).to.eql({});
        expect(invoked[2].params).to.eql({ msg: 'hello' });

        expect(doc.current.queue).to.eql([
          { name: 'Foo', params: { foo: 0 }, tx: 'tx.foo' },
          { name: 'Bar', params: {}, tx: 'tx.foo' },
          { name: 'Bar', params: { msg: 'hello' }, tx: 'tx.foo' },
        ]);

        dispose();
      });

      it('⚡️← custom paths', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const paths: t.CmdPaths = {
          queue: ['z', 'q'],
          total: ['t', 'a'],
        };
        const tx = 'tx.foo';
        const p = { msg: 'hello' };
        const cmd = Cmd.create<C>(doc, { paths });
        const fired: t.CmdTx[] = [];
        cmd.events(dispose$).tx$.subscribe((e) => fired.push(e));
        cmd.invoke('Bar', p, { tx });

        await Time.wait(0);
        expect(fired.length).to.eql(1);
        expect((doc.current as any).z.q).to.eql([{ name: 'Bar', params: p, tx }]);

        dispose();
      });

      it('⚡️← unique tx (default)', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);

        const fired: t.CmdTx[] = [];
        cmd.events(dispose$).tx$.subscribe((e) => fired.push(e));

        cmd.invoke('Foo', { foo: 0 });
        cmd.invoke('Bar', {});
        cmd.invoke('Bar', {}, { tx: '' }); // NB: empty string → tx IS generated.

        await Time.wait(0);
        const txs = fired.map((e) => e.tx);

        expect(txs.length).to.eql(3);
        expect(txs.every((tx) => typeof tx === 'string')).to.eql(true);
        expect(txs.every((tx) => tx !== '')).to.eql(true);
        expect(R.uniq(txs).length).to.eql(txs.length);
        dispose();
      });

      it('⚡️← specified tx', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);

        const fired: t.CmdTx[] = [];
        cmd.events(dispose$).tx$.subscribe((e) => fired.push(e));

        const tx = 'tx.foo';
        cmd.invoke('Foo', { foo: 0 }, { tx });
        cmd.invoke('Foo', { foo: 1 }, { tx });

        await Time.wait(0);
        expect(fired.length).to.eql(2);
        expect(fired.every((e) => e.tx === tx)).to.eql(true);
        expect(fired[0].params).to.eql({ foo: 0 });
        expect(fired[1].params).to.eql({ foo: 1 });
        dispose();
      });

      it('⚡️← tx factory', async () => {
        const { doc, dispose, dispose$ } = await setup();

        let count = 0;
        const tx = () => {
          count++;
          return `👋.${count}`;
        };
        const cmd = Cmd.create<C>(doc, { tx });

        const fired: t.CmdTx[] = [];
        cmd.events(dispose$).tx$.subscribe((e) => fired.push(e));

        cmd.invoke('Bar', {});
        cmd.invoke('Bar', {});

        await Time.wait(0);
        expect(fired[0].tx).to.eql('👋.1');
        expect(fired[1].tx).to.eql('👋.2');
        dispose();
      });
    });

    describe('filter', () => {
      it('.name<T>( ⚡️) ', async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);
        const events = cmd.events(dispose$);

        const fired: t.CmdTx[] = [];
        events.on('Foo').subscribe((e) => fired.push(e));

        cmd.invoke('Foo', { foo: 0 });
        cmd.invoke('Bar', {}); // NB: filtered out.

        await Time.wait(0);
        expect(fired.length).to.eql(1);
        expect(fired[0].name).to.eql('Foo');
        expect(fired[0].params).to.eql({ foo: 0 });

        dispose();
      });
    });

    describe('purge', () => {
      const setupPurge = async () => {
        const { doc, dispose, dispose$ } = await setup();
        const cmd = Cmd.create<C>(doc);
        const resolve = Cmd.Path.resolver();

        let foo = 0;
        const invoke = async (total: number) => {
          for (let i = 0; i < total; i++) {
            foo++;
            cmd.invoke('Foo', { foo });
          }
          await Time.wait(0);
        };

        const current = {
          get queue() {
            return resolve.queue.list(doc.current);
          },
        } as const;

        return {
          cmd,
          doc,
          dispose,
          dispose$,
          foo: { invoke },
          resolve,
          current,
        } as const;
      };

      it('fires correct sequence before/after purge', async () => {
        const { doc, dispose, current, dispose$, cmd, foo } = await setupPurge();

        const fired: t.CmdTx<C1>[] = [];
        const events = cmd.events(dispose$);
        events.on('Foo', (e) => fired.push(e));

        // Initial work.
        await foo.invoke(5);
        expect(fired.length).to.eql(5);
        expect(current.queue.length).to.eql(fired.length);

        // Purge.
        const purged = Cmd.Queue.purge(doc);
        expect(purged).to.eql(5);
        expect(current.queue.length).to.eql(0);

        // Keep working...
        await foo.invoke(1);

        expect(fired.length).to.eql(6);
        expect(current.queue.length).to.eql(1);
        expect(current.queue[0].params.foo).to.eql(6);
        expect(fired.map((e) => e.params.foo)).to.eql([1, 2, 3, 4, 5, 6]);

        dispose();
      });

      it('fast sequence, purged part-way through', async () => {
        const { doc, dispose, current, dispose$, cmd } = await setupPurge();

        const fired: t.CmdTx<C1>[] = [];
        const events = cmd.events(dispose$);
        events.on('Foo', (e) => fired.push(e));

        let foo = 0;
        const total = 10;
        for (let i = 0; i < total; i++) {
          foo++;
          cmd.invoke('Foo', { foo });
          if (foo === 5) {
            // NB: simulate an auto-purge taking place mid-stream within the loop.
            await Time.wait(0); //    ↓ ensure the document is up to date.
            Cmd.Queue.purge(doc); //  ↓ perform the purge.
          }
        }

        await Time.wait(0);
        const firedFoos = fired.map((e) => e.params.foo);
        const currentFoos = current.queue
          .map((item) => item.params as C1['params'])
          .map((params) => params.foo);

        expect(firedFoos).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(currentFoos).to.eql([6, 7, 8, 9, 10]);

        dispose();
      });
    });
  });
}
