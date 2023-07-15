import { Pkg, Time, describe, expect, expectError, it, rx, slug, type t } from '../test';

import { JsonBus } from '.';
import { DEFAULT } from './common.mjs';

const Setup = {
  instance: (): t.JsonBusInstance => ({ bus: rx.bus(), id: `foo.${slug()}` }),
  controller() {
    const instance = Setup.instance();
    const controller = JsonBus.Controller({ instance });
    const events = JsonBus.Events({ instance });

    const dispose = () => {
      controller.dispose();
      events.dispose();
    };

    return { instance, controller, dispose, events };
  },
};

describe('JsonBus', () => {
  type T = { count: number };

  describe('is', () => {
    const is = JsonBus.Events.is;

    it('is (static/instance)', () => {
      const instance = Setup.instance();
      const events = JsonBus.Events({ instance });
      expect(events.is).to.equal(is);
    });

    it('is.base', () => {
      const test = (type: string, expected: boolean) => {
        expect(is.base({ type, payload: {} })).to.eql(expected);
      };
      test('foo', false);
      test('sys.json/', true);
    });

    it('is.instance', () => {
      const type = 'sys.json/';
      expect(is.instance({ type, payload: { instance: 'abc' } }, 'abc')).to.eql(true);
      expect(is.instance({ type, payload: { instance: 'abc' } }, '123')).to.eql(false);
      expect(is.instance({ type: 'foo', payload: { instance: 'abc' } }, 'abc')).to.eql(false);
    });
  });

  describe('Controller/Events', () => {
    it('instance details', async () => {
      const { instance, controller, events, dispose } = Setup.controller();
      const busid = rx.bus.instance(instance.bus);

      expect(controller.instance.bus).to.equal(busid);
      expect(controller.instance.id).to.equal(instance.id);

      expect(events.instance.bus).to.equal(busid);
      expect(events.instance.id).to.equal(instance.id);

      dispose();
    });

    describe('info (module)', () => {
      it('info', async () => {
        const { instance, events, dispose } = Setup.controller();
        const res = await events.info.get();
        dispose();

        expect(res.instance).to.eql(instance.id);
        expect(res.info?.module.name).to.eql(Pkg.name);
        expect(res.info?.module.version).to.eql(Pkg.version);
        expect(res.info?.keys).to.eql([]);
      });
    });

    describe('events.state', () => {
      describe('state.get', () => {
        it('no key ("default"), no state', async () => {
          const { dispose, events, instance } = Setup.controller();
          const res = await events.state.get.fire();
          dispose();

          expect(res.instance).to.eql(instance.id);
          expect(res.key).to.eql(DEFAULT.KEY);
          expect(res.value).to.eql(undefined);
          expect(res.error).to.eql(undefined);
        });

        it('get <typed>', async () => {
          const { dispose, events } = Setup.controller();
          await events.state.put.fire<T>({ count: 123 });
          expect((await events.state.get.fire<T>()).value?.count).to.eql(123);

          dispose();
        });

        it('get - initial {object}', async () => {
          const { dispose, events } = Setup.controller();

          const res1 = await events.state.get.fire<T>({ key: '1', initial: { count: 1 } });
          const res2 = await events.state.get.fire<T>({ key: '2', initial: () => ({ count: 2 }) });

          expect(res1.value?.count).to.eql(1);
          expect(res2.value?.count).to.eql(2);

          expect((await events.json<T>({ count: 0 }, { key: '1' }).get()).value?.count).to.eql(1);
          expect((await events.json<T>({ count: 0 }, { key: '2' }).get()).value?.count).to.eql(2);

          dispose();
        });
      });

      describe('state.put', () => {
        it('put<T> (default key)', async () => {
          const { dispose, events, controller, instance } = Setup.controller();

          // BEFORE state
          expect((await events.state.get.fire()).value).to.eql(undefined);
          expect((await events.info.get()).info?.keys).to.eql([]);

          const fired: t.JsonStateChange[] = [];
          controller.changed$.subscribe((e) => fired.push(e));

          const value: T = { count: 123 };
          const res = await events.state.put.fire<T>(value);

          expect(res.instance).to.eql(instance.id);
          expect(res.key).to.eql(DEFAULT.KEY);

          // AFTER state
          expect((await events.state.get.fire()).value).to.eql(value);
          expect((await events.info.get()).info?.keys).to.eql([DEFAULT.KEY]);

          expect(fired.length).to.eql(1);
          expect(fired[0].key).to.eql(DEFAULT.KEY);
          expect(fired[0].op).to.eql('replace');
          expect(fired[0].value).to.eql(value);

          dispose();
        });

        it('put (specific key)', async () => {
          const { dispose, events } = Setup.controller();
          expect((await events.info.get()).info?.keys).to.eql([]);

          const key = 'foo.bar/baz';
          const value = { msg: 'hello' };
          await events.state.put.fire(value, { key });

          expect((await events.info.get()).info?.keys).to.eql([key]); // BEFORE
          expect((await events.state.get.fire({ key })).value).to.eql(value);

          dispose();
        });
      });

      describe('state.patch', () => {
        it('mutator (sync)', async () => {
          const { dispose, events, instance } = Setup.controller();

          await events.state.put.fire<T>({ count: 123 });
          const res = await events.state.patch.fire<T>((prev, ctx) => prev.count++);

          expect(res.key).to.eql(DEFAULT.KEY);
          expect(res.instance).to.eql(instance.id);
          expect(res.error).to.eql(undefined);

          expect((await events.state.get.fire()).value).to.eql({ count: 124 });
          dispose();
        });

        it('mutator (async)', async () => {
          const { dispose, events } = Setup.controller();

          const initial: T = { count: 10 };
          await events.state.patch.fire<T>(
            async (prev) => {
              await Time.wait(5);
              prev.count += 10;
            },
            { initial },
          );

          expect((await events.state.get.fire()).value).to.eql({ count: 20 });
          dispose();
        });

        it('patch with {initial} value option', async () => {
          const { dispose, events } = Setup.controller();

          const initial: T = { count: 10 };
          const patch = events.state.patch;

          await patch.fire<T>((prev) => (prev.count -= 5), { key: '1', initial });
          expect((await events.state.get.fire({ key: '1' })).value).to.eql({ count: 5 });

          await patch.fire<T>((prev) => (prev.count += 5), { key: '2', initial: () => initial });
          expect((await events.state.get.fire({ key: '2' })).value).to.eql({ count: 15 });

          dispose();
        });

        it('patch on key object', async () => {
          const { dispose, events } = Setup.controller();

          const key = 'foo.bar';
          const initial: T = { count: 10 };
          await events.state.patch.fire<T>((prev) => (prev.count += 1), { initial, key });
          await events.state.patch.fire<T>((prev) => (prev.count += 4), { key });

          expect((await events.state.get.fire({ key })).value).to.eql({ count: 15 });
          dispose();
        });

        it('throw: no current state', async () => {
          const { dispose, events } = Setup.controller();

          const res1 = await events.state.patch.fire((prev) => null);
          const res2 = await events.state.patch.fire((prev) => null, { key: 'foo' });
          dispose();

          // Failed to patch, could not retrieve current state
          expect(res1.error).to.include('Failed to patch, could not retrieve current state');
          expect(res2.error).to.include('key="foo"');
        });
      });
    });

    describe('events.json<T>(...)', () => {
      it('.get(...)', async () => {
        const { events, dispose } = Setup.controller();

        await events.state.put.fire<T>({ count: 123 });
        const res1 = await events.json<T>({ count: 0 }).get();
        const res2 = await events.json<T>({ count: 1 }, { key: '1' }).get();
        const res3 = await events.json<T>(() => ({ count: 2 }), { key: '2' }).get();

        expect(res1.key).to.eql(DEFAULT.KEY);
        expect(res2.key).to.eql('1');
        expect(res3.key).to.eql('2');

        expect(res1.value?.count).to.eql(123);
        expect(res2.value?.count).to.eql(1);
        expect(res3.value?.count).to.eql(2);

        dispose();
      });

      it('.put(...)', async () => {
        const { events, dispose } = Setup.controller();

        const key = 'foo';
        const initial: T = { count: 0 };
        const res1 = await events.json<T>(initial).put({ count: 123 });
        const res2 = await events.json<T>(initial, { key }).put({ count: 456 });

        expect(res1.key).to.eql(DEFAULT.KEY);
        expect(res2.key).to.eql(key);

        expect((await events.info.get()).info?.keys).to.eql([DEFAULT.KEY, key]);
        expect((await events.state.get.fire()).value).to.eql({ count: 123 });
        expect((await events.state.get.fire({ key })).value).to.eql({ count: 456 });

        dispose();
      });

      it('.patch(...)', async () => {
        const { events, dispose } = Setup.controller();

        const key = 'foo';
        const initial: T = { count: 10 };
        await events.state.put.fire<T>({ count: 1 });

        const res1 = await events.json<T>(initial).patch((prev) => prev.count++);
        const res2 = await events.json<T>(initial, { key }).patch((prev, ctx) => prev.count--);

        expect(res1.key).to.eql(DEFAULT.KEY);
        expect(res2.key).to.eql(key);

        expect((await events.state.get.fire()).value).to.eql({ count: 2 });
        expect((await events.state.get.fire({ key })).value).to.eql({ count: 9 });

        dispose();
      });

      it('.$ (change stream)', async () => {
        const { events, dispose } = Setup.controller();
        const json = events.json<T>({ count: 0 });

        const fired: t.JsonStateChange<T>[] = [];
        json.$.subscribe((e) => fired.push(e));

        await json.put({ count: 1 });

        expect(fired.length).to.eql(1);
        expect(fired[0].op).to.eql('replace');
        expect(fired[0].value).to.eql({ count: 1 });

        await json.patch((prev) => (prev.count = 99));

        expect(fired.length).to.eql(2);
        expect(fired[1].op).to.eql('update');
        expect(fired[1].value).to.eql({ count: 99 });

        dispose();
      });

      it('.current', async () => {
        const { events, dispose } = Setup.controller();

        const initial: T = { count: 10 };
        const json = events.json<T>(initial);
        expect(json.current).to.eql(initial);

        await json.patch((prev) => (prev.count -= 5));
        expect(json.current).to.eql({ count: 5 });

        dispose();
      });
    });

    describe('changed$', () => {
      it('fires - replace / update', async () => {
        const { events, dispose } = Setup.controller();

        const fired: t.JsonStateChange[] = [];
        events.changed$.subscribe((e) => fired.push(e));
        const json = events.json<T>({ count: 0 });

        await json.get();
        expect(fired.length).to.eql(1);
        expect(fired[0].op).to.eql('replace'); // Iniital value set.
        expect(fired[0].value).to.eql({ count: 0 });

        await json.put({ count: 1 });
        expect(fired.length).to.eql(2);
        expect(fired[1].op).to.eql('replace');
        expect(fired[1].value).to.eql({ count: 1 });

        // NB: a PUT operation will always cause the event to fire, even when the values
        //    are identical. PATCH operations are more granular (for performance reasons).
        await json.put({ count: 1 });
        expect(fired.length).to.eql(3);
        expect(fired[2].op).to.eql('replace');
        expect(fired[2].value).to.eql({ count: 1 });

        await json.patch((prev) => prev.count++);

        expect(fired.length).to.eql(4);
        expect(fired[3].op).to.eql('update');
        expect(fired[3].value).to.eql({ count: 2 });

        dispose();
      });

      it('does not repeat fire when patch yields no changes', async () => {
        const { events, dispose } = Setup.controller();

        const fired: t.JsonStateChange[] = [];
        events.changed$.subscribe((e) => fired.push(e));
        const json = events.json<T>({ count: 0 });

        await json.patch((prev) => prev.count++);

        expect(fired.length).to.eql(2); // NB: First event is the {initial} PUT.
        expect(fired[0].op).to.eql('replace');
        expect(fired[1].op).to.eql('update');
        expect(fired[0].value).to.eql({ count: 0 });
        expect(fired[1].value).to.eql({ count: 1 });

        await json.patch(() => null); //   NB: do nothing.
        expect(fired.length).to.eql(2); // NB: no change.

        dispose();
      });

      it('fires on method/key subset', async () => {
        const { events, dispose } = Setup.controller();

        const initial: T = { count: 0 };
        const json1 = events.json<T>(initial);
        const json2 = events.json<T>(initial, { key: '2' });

        const fired1: t.JsonStateChange[] = [];
        const fired2: t.JsonStateChange[] = [];

        json1.$.subscribe((e) => fired1.push(e));
        json2.$.subscribe((e) => fired2.push(e));

        await json1.put({ count: 1 });
        await json2.put({ count: 2 });
        await json2.patch((prev) => prev.count++);

        expect(fired1.length).to.eql(1);
        expect(fired2.length).to.eql(2);

        expect(fired1[0].value).to.eql({ count: 1 });
        expect(fired2[1].value).to.eql({ count: 3 });

        expect(fired1.every((e) => e.key === DEFAULT.KEY)).to.eql(true);
        expect(fired2.every((e) => e.key === '2')).to.eql(true);

        dispose();
      });
    });

    describe('json.lens (method)', () => {
      type T = { child: { count: number } };

      it('lens.current', async () => {
        const { events, dispose } = Setup.controller();
        const initial: T = { child: { count: 0 } };

        const lens = events.json<T>(initial).lens((root) => root.child);
        expect(lens.current).to.eql({ count: 0 });

        await lens.patch((target) => (target.count += 5));
        expect(lens.current).to.eql({ count: 5 });
        dispose();
      });

      it('lens.$', async () => {
        const { events, dispose } = Setup.controller();
        const initial: T = { child: { count: 0 } };

        const lens = events.json<T>(initial).lens((root) => root.child);

        const fired: T['child'][] = [];
        lens.$.subscribe((e) => fired.push(e));

        await lens.patch((target) => (target.count += 5));
        expect(fired.length).to.eql(2);
        expect(fired[0]).to.eql({ count: 0 });
        expect(fired[1]).to.eql({ count: 5 });

        dispose();
      });

      it('lens (target [root])', async () => {
        const { events, dispose } = Setup.controller();
        const initial: T = { child: { count: 0 } };

        const lens = events.json<T>(initial).lens((root) => root);
        expect(lens.current).to.eql(initial);

        await lens.patch((target, ctx) => (target.child.count += 5));
        expect(lens.current).to.eql({ child: { count: 5 } });
        dispose();
      });

      describe('lens.patch', () => {
        it('patch (child target)', async () => {
          const { events, dispose } = Setup.controller();
          const initial: T = { child: { count: 0 } };

          const lens = events.json<T>(initial).lens((root) => root.child);
          await lens.patch((target, ctx) => (target.count += 5));

          expect(lens.current).to.eql({ count: 5 });
          dispose();
        });

        it('throw: root/target objects not derived', async () => {
          const { events, dispose } = Setup.controller();

          // NB: no target supplied from factory.
          await expectError(async () => {
            const initial: T = { child: { count: 10 } };
            const lens = events.json<T>(initial).lens((root) => null as any);
            await lens.patch((doc) => doc.count++);
          }, 'Lens target child could not be derived');

          dispose();
        });
      });
    });
  });
});
