import { Immutable } from '.';
import { describe, expect, it, type t } from '../test';
import { rx } from './common';

describe('Immutable', () => {
  type P = t.PatchOperation;
  type D = { count: number; list?: number[] };

  describe('Immutable.cloner', () => {
    it('defaults', () => {
      const initial = { count: 0 };
      const obj = Immutable.cloner<D>(initial);
      expect(obj.current).to.not.equal(initial);
      expect(obj.current).to.eql({ count: 0 });

      obj.change((d) => (d.count = 123));
      expect(obj.current).to.eql({ count: 123 });
    });

    it('custom cloner', () => {
      let count = 0;
      const clone = <D>(input: D) => {
        count++;
        return { ...input };
      };
      const initial = { count: 0 };
      const obj = Immutable.cloner<D>({ count: 0 }, { clone });
      expect(obj.current).to.not.equal(initial);
      expect(count).to.eql(1); // NB: initial clone.
      expect(obj.current).to.eql({ count: 0 });

      obj.change((d) => (d.count = 123));
      expect(obj.current).to.eql({ count: 123 });
      expect(count).to.eql(2);
    });

    it('patches (callback)', () => {
      const initial = { count: 0, list: [] };
      const obj = Immutable.cloner<D>(initial);

      const patches: t.PatchOperation[] = [];
      obj.change((d) => (d.count = 123), { patches: (e) => patches.push(...e) });
      obj.change(
        (d) => {
          d.list![0] = 555;
          d.list![9] = 888;
        },
        (e) => patches.push(...e),
      );

      expect(patches.length).to.eql(3);
      expect(patches[0]).to.eql({ op: 'replace', path: '/count', value: 123 });
      expect(patches[1]).to.eql({ op: 'add', path: '/list/0', value: 555 });
      expect(patches[2]).to.eql({ op: 'add', path: '/list/9', value: 888 });
    });
  });

  describe('Immutable.events.viaOverride', () => {
    it('overrides change handler', () => {
      const obj = Immutable.cloner<D>({ count: 0 });
      const change = obj.change;
      Immutable.events.viaOverride(obj);
      expect(obj.change).to.not.equal(change);
    });

    it('fires events by overriding change handler', () => {
      const obj = Immutable.cloner<D>({ count: 0 });
      const events = Immutable.events.viaOverride(obj);

      const fired: t.ImmutableChange<D, P>[] = [];
      events.changed$.subscribe((e) => fired.push(e));

      obj.change((d) => (d.count = 123));
      expect(fired.length).to.eql(1);
      expect(fired[0].before).to.eql({ count: 0 });
      expect(fired[0].after).to.eql({ count: 123 });
    });

    it('patches: matches fired event', () => {
      const obj = Immutable.cloner<D>({ count: 0 });
      const events = Immutable.events.viaOverride(obj);

      const patches: t.PatchOperation[] = [];
      const fired: t.ImmutableChange<D, P>[] = [];
      events.changed$.subscribe((e) => fired.push(e));

      obj.change(
        (d) => (d.count = 123),
        (e) => patches.push(...e),
      );

      expect(fired.length).to.eql(1);
      expect(patches.length).to.eql(1);
      expect(patches.length).to.eql(1);
      expect(patches[0]).to.eql({ op: 'replace', path: '/count', value: 123 });
      expect(fired[0].patches[0]).to.eql(patches[0]);
    });

    describe('dispose', () => {
      it('via method', () => {
        const obj = Immutable.cloner<D>({ count: 0 });
        const events = Immutable.events.viaOverride(obj);
        const fired: t.ImmutableChange<D, P>[] = [];
        events.changed$.subscribe((e) => fired.push(e));
        events.dispose();
        expect(events.disposed).to.eql(true);

        obj.change((d) => (d.count = 123));
        expect(fired.length).to.eql(0);
        expect(obj.current).to.eql({ count: 123 });
      });

      it('via {dispose$} observable', () => {
        const life = rx.lifecycle();
        const obj = Immutable.cloner<D>({ count: 0 });
        const events = Immutable.events.viaOverride(obj, life.dispose$);
        const fired: t.ImmutableChange<D, P>[] = [];
        events.changed$.subscribe((e) => fired.push(e));
        life.dispose();
        expect(events.disposed).to.eql(true);

        obj.change((d) => (d.count = 123));
        expect(fired.length).to.eql(0);
        expect(obj.current).to.eql({ count: 123 });
      });

      it('reverts handler upon dispose', () => {
        const obj = Immutable.cloner<D>({ count: 0 });
        const change = obj.change;
        const events = Immutable.events.viaOverride(obj);
        expect(obj.change).to.not.equal(change);
        events.dispose();
        expect(obj.change).to.equal(change);
      });
    });
  });

  describe('Immutable.clonerRef', () => {
    it('defaults', async () => {
      const initial = { count: 0 };
      const obj = Immutable.clonerRef<D>(initial);
      expect(obj.current).to.not.equal(initial);
      expect(obj.current).to.eql({ count: 0 });

      obj.change((d) => (d.count = 123));
      expect(obj.current).to.eql({ count: 123 });
      expect(obj.instance).to.be.a.string;
    });

    it('change (patches)', async () => {
      const initial = { count: 0 };
      const obj = Immutable.clonerRef<D>(initial);
      expect(obj.current).to.not.equal(initial);
      expect(obj.current).to.eql({ count: 0 });

      const patches: t.PatchOperation[] = [];
      obj.change((d) => (d.count = 123), { patches: (e) => patches.push(...e) });
      obj.change(
        (d) => (d.count = 456),
        (e) => patches.push(...e),
      );

      expect(patches).to.eql([
        { op: 'replace', path: '/count', value: 123 },
        { op: 'replace', path: '/count', value: 456 },
      ]);
    });

    it('events', async () => {
      const life = rx.disposable();
      const initial = { count: 0 };
      const obj = Immutable.clonerRef<D>(initial);
      const events1 = obj.events(life.dispose$);
      const events2 = obj.events();

      const fired1: t.ImmutableChange<D, P>[] = [];
      const fired2: t.ImmutableChange<D, P>[] = [];
      events1.changed$.subscribe((e) => fired1.push(e));
      events2.changed$.subscribe((e) => fired2.push(e));

      obj.change((d) => (d.count = 123));

      expect(fired1.length).to.eql(1);
      expect(fired1).to.eql(fired2);

      const e = fired1[0];
      expect(e.before).to.eql({ count: 0 });
      expect(e.after).to.eql({ count: 123 });
      expect(e.patches).to.eql([{ op: 'replace', path: '/count', value: 123 }]);

      expect(events1.disposed).to.eql(false);
      expect(events2.disposed).to.eql(false);

      life.dispose();
      expect(events1.disposed).to.eql(true);
      expect(events2.disposed).to.eql(false);
      events2.dispose();
      expect(events2.disposed).to.eql(true);
    });

    it('events continue firing on non-related <events> instances', () => {
      const obj = Immutable.clonerRef<D>({ count: 0 });
      const events1 = obj.events();
      const events2 = obj.events();

      let fired1 = 0;
      let fired2 = 0;
      events1.changed$.subscribe(() => fired1++);
      events2.changed$.subscribe(() => fired2++);

      obj.change((d) => (d.count = 123));
      expect(fired1).to.eql(1);
      expect(fired2).to.eql(1);

      events1.dispose();
      obj.change((d) => (d.count = 456));
      expect(fired1).to.eql(1);
      expect(fired2).to.eql(2);
    });
  });

  describe('Immutable.Is', () => {
    const Is = Immutable.Is;
    const NON = [123, 'abc', [], {}, undefined, null, true, Symbol('foo'), BigInt(0)];

    it('Is.immutable', () => {
      NON.forEach((v) => expect(Is.immutable(v)).to.eql(false));
      const obj = Immutable.cloner<D>({ count: 0 });
      expect(Is.immutable(obj)).to.eql(true);
    });

    it('Is.immutableRef', () => {
      NON.forEach((v) => expect(Is.immutable(v)).to.eql(false));
      const obj = Immutable.cloner<D>({ count: 0 });
      const objRef = Immutable.clonerRef<D>({ count: 0 });
      expect(Is.immutableRef(obj)).to.eql(false);
      expect(Is.immutableRef(objRef)).to.eql(true);
    });
  });
});
