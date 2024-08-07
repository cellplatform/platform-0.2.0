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
        async invoke() {
          foo.invoked++;
          method({ foo: foo.invoked });
          await Time.wait(10);
        },
      };

      const expectQueue = (total: number, assert = true) => {
        const queue = resolve.queue.list(doc.current);
        if (assert) expect(queue.length).to.eql(total);
      };

      return { doc, cmd, method, resolve, dispose, expectQueue, foo } as const;
    };

    it('queue grows', async () => {
      const { dispose, foo, expectQueue } = await setupQueue();

      expectQueue(0);
      await foo.invoke();
      expectQueue(1);

      for (const _ of Array.from({ length: 10 })) {
        await foo.invoke();
      }
      expectQueue(11);
      dispose();
    });

  });
}
