import { Immutable } from '.';
import { describe, expect, it, type t } from '../test';
import { rx } from './common';

describe('Immutable', () => {
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
      expect(count).to.eql(1); // NB: initial clone
      expect(obj.current).to.eql({ count: 0 });

      obj.change((d) => (d.count = 123));
      expect(obj.current).to.eql({ count: 123 });
      expect(count).to.eql(2);
    });

    it.only('patches (callback)', () => {
      const initial = { count: 0, list: [] };
      const obj = Immutable.cloner<D>(initial);

      const patches: t.Patch[] = [];
      obj.change((d) => (d.count = 123), { patches: (e) => patches.push(...e) });
      obj.change(
        (d) => {
          d.list![0] = 555;
          d.list![9] = 888;
        },
        (e) => patches.push(...e),
      );

      expect(patches.length).to.eql(3);
      expect(patches[0]).to.eql({ action: 'put', path: ['count'], value: 123 });
      expect(patches[1]).to.eql({ action: 'insert', path: ['list', 0], value: 555 });
      expect(patches[2]).to.eql({ action: 'insert', path: ['list', 9], value: 888 });
    });
  });

  describe('Immutable.events', () => {
    it('overrides change handler', () => {
      const obj = Immutable.cloner<D>({ count: 0 });
      const change = obj.change;
      Immutable.events(obj);
      expect(obj.change).to.not.equal(change);
    });

    it('fires events by overriding change handler', () => {
      const obj = Immutable.cloner<D>({ count: 0 });
      const events = Immutable.events(obj);

      const fired: t.ImmutableChange<D>[] = [];
      events.changed$.subscribe((e) => fired.push(e));

      obj.change((d) => (d.count = 123));
      expect(fired.length).to.eql(1);
      expect(fired[0].before).to.eql({ count: 0 });
      expect(fired[0].after).to.eql({ count: 123 });
    });

    it('patches (callback) matches fired event', () => {
      const obj = Immutable.cloner<D>({ count: 0 });
      const events = Immutable.events(obj);

      const patches: t.Patch[] = [];
      const fired: t.ImmutableChange<D>[] = [];
      events.changed$.subscribe((e) => fired.push(e));

      obj.change(
        (d) => (d.count = 123),
        (e) => patches.push(...e),
      );

      expect(fired.length).to.eql(1);
      expect(patches.length).to.eql(1);
      expect(patches[0]).to.eql({ action: 'replace', path: ['count'], value: 123 });
    });

    describe('dispose', () => {
      it('via method', () => {
        const obj = Immutable.cloner<D>({ count: 0 });
        const events = Immutable.events(obj);
        const fired: t.ImmutableChange<D>[] = [];
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
        const events = Immutable.events(obj, life.dispose$);
        const fired: t.ImmutableChange<D>[] = [];
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
        const events = Immutable.events(obj);
        expect(obj.change).to.not.equal(change);
        events.dispose();
        expect(obj.change).to.equal(change);
      });
    });
  });
});
