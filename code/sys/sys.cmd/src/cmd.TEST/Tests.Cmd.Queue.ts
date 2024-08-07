import { Cmd } from '..';
import { Time, type t } from './common';

import type { C } from './t';

export function queueTests(setup: t.CmdTestSetup, args: t.TestArgs) {
  const { describe, it, expect } = args;

  describe('Cmd.Queue', () => {
    const setupQueue = async () => {
      const { factory, dispose } = await setup();
      const doc = await factory();
      const cmd = Cmd.create<C>(doc);
      const method = cmd.method('Foo');
      const resolve = Cmd.Path.resolver();

      const foo = {
        method,
        invoked: 0,
        async invoke(times = 1) {
          for (let i = 0; i < times; i++) {
            foo.invoked++;
            method({ foo: foo.invoked });
            await Time.wait(10);
          }
        },
      };

      const current = {
        get queue() {
          return resolve.queue.list(doc.current);
        },
        get total() {
          return resolve.total(doc.current);
        },
        get object() {
          return resolve.toObject(doc.current);
        },
      } as const;

      const expectQueue = (total: number, assert = true) => {
        const queue = current.queue;
        if (assert) expect(queue.length).to.eql(total);
      };

      return {
        doc,
        cmd,
        method,
        resolve,
        dispose,
        expectQueue,
        foo,
        current,
      } as const;
    };

    it('baseline: the queue grows', async () => {
      const { dispose, foo, expectQueue } = await setupQueue();

      expectQueue(0);
      await foo.invoke();
      expectQueue(1);

      await foo.invoke(10);
      expectQueue(11);

      dispose();
    });

    describe('Queue.purge', () => {
      it('.purge ← default (empty)', async () => {
        const { dispose, foo, expectQueue, current, doc } = await setupQueue();

        await foo.invoke(5);
        expectQueue(5);
        expect(current.total.purged).to.eql(0);

        const res = Cmd.Queue.purge(doc);
        expectQueue(0);
        expect(res.purged).to.eql(5);

        dispose();
      });

      it('.purge ← retrain items', async () => {
        const { dispose, foo, expectQueue, current, doc, resolve } = await setupQueue();

        await foo.invoke(5);
        expectQueue(5);
        expect(current.total.purged).to.eql(0);

        const res = Cmd.Queue.purge(doc, { retain: 2 });
        expectQueue(2);
        expect(res.purged).to.eql(3);
        expect(current.queue.map((e) => e.params.foo)).to.eql([4, 5]);

        dispose();
      });
    });

  });
}
