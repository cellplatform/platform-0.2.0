import { Cmd } from '..';
import { Time, type t } from './common';

export function methodTests(setup: t.CmdTestSetup, args: t.TestArgs) {
  const { describe, it, expect } = args;

  type P = { a: number; b: number };
  type R = { sum: number };
  type E = t.Error & { code: number; type: 'bounds' };
  type C = C1 | C2 | C3;
  type C1 = t.CmdType<'add', P, C2, E>;
  type C2 = t.CmdType<'add:res', R>;
  type C3 = t.CmdType<'foo', { msg?: string }>;
  const sum = ({ a, b }: P): R => ({ sum: a + b });

  describe('examples', () => {
    /**
     * This manual example shows the basics of call and response
     * using nothing but the {Cmd} primitives.
     *
     * The {Response} and {Listener} helpers are simply wrappers
     * around the observable pattern below to provide some strongly
     * typed developer ergonomics.
     */
    it('via manual event hookup', async () => {
      const { doc, dispose, dispose$ } = await setup();
      const cmd = Cmd.create<C>(doc);
      const events = cmd.events(dispose$);

      const responses: t.CmdTx<C2>[] = [];
      events.on('add').subscribe((e) => cmd.invoke('add:res', sum(e.params)));
      events.on('add:res').subscribe((e) => responses.push(e));

      cmd.invoke('add', { a: 2, b: 3 });
      await Time.wait(20);

      expect(responses[0].params.sum).to.eql(5);
      dispose();
    });
  });

  describe('Method', () => {
    it('factory overloads (void | responder)', async () => {
      const { doc, dispose } = await setup();
      const cmd = Cmd.create<C>(doc);
      const res1 = cmd.method('foo');
      const res2 = cmd.method('add', 'add:res');
      expect(typeof res1 === 'function').to.eql(true);
      expect(typeof res2 === 'function').to.eql(true);
      dispose();
    });

    it('invoke: (void)', async () => {
      const { doc, dispose, dispose$ } = await setup();
      const cmd = Cmd.create<C>(doc);
      const method = cmd.method('foo');

      const fired: t.CmdTx<C3>[] = [];
      cmd
        .events(dispose$)
        .on('foo')
        .subscribe((e) => fired.push(e));

      const res = method({ msg: 'hello' });
      await Time.wait(0);

      expect(res.req.name).to.eql('foo');
      expect(res.req.params).to.eql({ msg: 'hello' });

      expect(fired.length).to.eql(1);
      expect(fired[0].name).to.eql('foo');
      expect(fired[0].params).to.eql({ msg: 'hello' });
      expect(fired[0].tx).to.eql(res.tx);

      dispose();
    });

    it('invoke: (response)', async () => {
      const { doc, dispose, dispose$ } = await setup();
      const cmd = Cmd.create<C>(doc);
      const method = cmd.method('add', 'add:res');
      const events = cmd.events(dispose$);
      events.on('add').subscribe((e) => cmd.invoke('add:res', sum(e.params), e.tx));

      const res = await method({ a: 1, b: 2 }).promise();
      expect(res.result?.sum).to.eql(3);
      dispose();
    });
  });
}
