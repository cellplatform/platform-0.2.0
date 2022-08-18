import * as t from '@platform/types';

import { expect } from 'chai';
import { rx } from '.';

import { Pump } from './rx.pump';

type E = {
  type: 'foo';
  payload: { count?: number; msg?: string };
};

describe('Pump', () => {
  describe('create', () => {
    it('create with id', () => {
      const bus = rx.bus();
      const pump = Pump.create(bus);
      expect(pump.id).to.eql(`pump:${rx.bus.instance(bus)}`);
    });

    it('pump: in/out', () => {
      const bus = rx.bus<E>();
      const pump = Pump.create<E>(bus);

      const fired: E[] = [];
      const event: E = { type: 'foo', payload: {} };

      pump.in((e) => fired.push(e));
      pump.out(event);

      expect(fired.length).to.eql(1);
      expect(fired[0]).to.eql(event);
    });

    it('{ dispose$ } option', () => {
      const { dispose, dispose$ } = rx.disposable();
      const bus = rx.bus<E>();
      const pump = Pump.create<E>(bus, { dispose$ });

      const fired: E[] = [];
      const event: E = { type: 'foo', payload: {} };

      dispose();
      pump.in((e) => fired.push(e));
      pump.out(event);

      expect(fired).to.eql([]);
    });

    it('filter (pump)', () => {
      let allow = false;
      const filter: t.EventPumpFilter = (e) => allow;

      const bus = rx.bus<E>();
      const pump = Pump.create<E>(bus, { filter });

      const fired: E[] = [];
      const event: E = { type: 'foo', payload: {} };

      pump.in((e) => fired.push(e));
      pump.out(event);
      expect(fired).to.eql([]);

      allow = true;
      pump.out(event);

      expect(fired.length).to.eql(1);
      expect(fired[0]).to.eql(event);
    });

    it('throw: input not an event-bus', () => {
      const test = (input: any) => {
        const fn = () => Pump.create(input);
        expect(fn).to.throw(/Not a valid event-bus/);
      };

      test(undefined);
      test(null);
      test(123);
      test({});
    });
  });

  describe('connect', () => {
    it('fire events (two-way, duplex)', () => {
      const bus1 = rx.bus<E>();
      const bus2 = rx.bus<E>();
      const pump = Pump.create<E>(bus1);

      let fired1: E[] = [];
      let fired2: E[] = [];
      const reset = () => {
        fired1 = [];
        fired2 = [];
      };

      bus1.$.subscribe((e) => fired1.push(e));
      bus2.$.subscribe((e) => fired2.push(e));
      bus1.fire({ type: 'foo', payload: {} });
      expect(fired1.length).to.eql(1);
      expect(fired2).to.eql([]); // NB: not connected.

      Pump.connect(pump).to(bus2);

      reset();
      bus1.fire({ type: 'foo', payload: { msg: 'from-1' } });

      expect(fired1.length).to.eql(1);
      expect(fired2.length).to.eql(1);
      expect(fired1[0].payload.msg).to.eql('from-1');
      expect(fired2[0].payload.msg).to.eql('from-1');

      reset();
      bus2.fire({ type: 'foo', payload: { msg: 'from-2' } });

      expect(fired1.length).to.eql(1);
      expect(fired2.length).to.eql(1);
      expect(fired1[0].payload.msg).to.eql('from-2');
      expect(fired2[0].payload.msg).to.eql('from-2');
    });

    it('throw: if connected bus is the same as the one inside the pump', () => {
      const bus = rx.bus();
      const pump = Pump.create(bus);
      const fn = () => Pump.connect(pump).to(bus);
      expect(fn).to.throw(/to a pump containing itself/);
    });

    describe('dispose', () => {
      it('connection.dispose() method', () => {
        const bus1 = rx.bus<E>();
        const bus2 = rx.bus<E>();
        const pump = Pump.create<E>(bus2);
        const connection = Pump.connect(pump).to(bus1);

        const fired = {
          bus1: <E[]>[],
          bus2: <E[]>[],
          reset() {
            fired.bus1 = [];
            fired.bus2 = [];
          },
        };

        bus1.$.subscribe((e) => fired.bus1.push(e));
        bus2.$.subscribe((e) => fired.bus2.push(e));

        expect(connection.alive).to.eql(true);

        bus1.fire({ type: 'foo', payload: {} });
        bus2.fire({ type: 'foo', payload: {} });
        expect(fired.bus1.length).to.eql(2);
        expect(fired.bus2.length).to.eql(2);
        fired.reset();

        let count = 0;
        connection.dispose$.subscribe(() => count++);

        connection.dispose();
        expect(count).to.eql(1);
        expect(connection.alive).to.eql(false);

        bus1.fire({ type: 'foo', payload: {} });
        expect(fired.bus1.length).to.eql(1, 'bus1');
        expect(fired.bus2.length).to.eql(0, 'bus2');

        fired.reset();
        bus2.fire({ type: 'foo', payload: {} });
        expect(fired.bus1.length).to.eql(0, 'bus1');
        expect(fired.bus2.length).to.eql(1, 'bus2');
      });

      it('connection({ dispose$ }) parameter option', () => {
        const { dispose, dispose$ } = rx.disposable();

        const bus1 = rx.bus<E>();
        const bus2 = rx.bus<E>();
        const pump = Pump.create<E>(bus2);
        const connection = Pump.connect(pump, { dispose$ }).to(bus1);
        expect(connection.alive).to.eql(true);

        const fired = {
          bus1: <E[]>[],
          bus2: <E[]>[],
          reset() {
            fired.bus1 = [];
            fired.bus2 = [];
          },
        };
        bus1.$.subscribe((e) => fired.bus1.push(e));
        bus2.$.subscribe((e) => fired.bus2.push(e));

        let count = 0;
        connection.dispose$.subscribe(() => count++);

        dispose(); // NB: Fires the {dispose$} parameter.
        expect(count).to.eql(1);
        expect(connection.alive).to.eql(false);

        bus1.fire({ type: 'foo', payload: {} });
        expect(fired.bus1.length).to.eql(1, 'bus1');
        expect(fired.bus2.length).to.eql(0, 'bus2');

        fired.reset();
        bus2.fire({ type: 'foo', payload: {} });
        expect(fired.bus1.length).to.eql(0, 'bus1');
        expect(fired.bus2.length).to.eql(1, 'bus2');
      });
    });

    describe('filter (connection)', () => {
      it('clone and filter the connection', () => {
        const bus1 = rx.bus<E>();
        const bus2 = rx.bus<E>();
        const pump = Pump.create<E>(bus2);

        const conn1 = Pump.connect(pump).to(bus1);
        const conn2 = conn1.filter(() => true);

        expect(conn1).to.not.equal(conn2);
      });

      it('dispose child (filter/cloned) connection does not dispose the parent connection', () => {
        const bus1 = rx.bus<E>();
        const bus2 = rx.bus<E>();
        const pump = Pump.create<E>(bus2);

        const conn1 = Pump.connect(pump).to(bus1);
        const conn2 = conn1.filter(() => true);

        expect(conn1.alive).to.eql(true);
        expect(conn2.alive).to.eql(true);

        conn2.dispose();
        expect(conn1.alive).to.eql(true); // NB: not disposed.
        expect(conn2.alive).to.eql(false);
      });

      it('dispose root/parent connection disposes child filter/cloned connections', () => {
        const bus1 = rx.bus<E>();
        const bus2 = rx.bus<E>();
        const pump = Pump.create<E>(bus2);

        const conn1 = Pump.connect(pump).to(bus1);
        const conn2 = conn1.filter(() => true);
        const conn3 = conn1.filter(() => false);

        expect(conn1.alive).to.eql(true);
        expect(conn2.alive).to.eql(true);
        expect(conn3.alive).to.eql(true);

        conn1.dispose();
        expect(conn1.alive).to.eql(false);
        expect(conn2.alive).to.eql(false);
        expect(conn3.alive).to.eql(false);
      });

      it('filter events via { filter } input parameter', () => {
        const bus1 = rx.bus<E>();
        const bus2 = rx.bus<E>();
        const pump = Pump.create<E>(bus2);

        const filter: t.EventPumpFilter = (e) => e.event.payload.msg !== 'filter-me';
        Pump.connect(pump, { filter }).to(bus1);

        const fired = {
          bus1: <E[]>[],
          bus2: <E[]>[],
          reset() {
            fired.bus1 = [];
            fired.bus2 = [];
          },
        };

        bus1.$.subscribe((e) => fired.bus1.push(e));
        bus2.$.subscribe((e) => fired.bus2.push(e));

        bus1.fire({ type: 'foo', payload: {} });
        bus2.fire({ type: 'foo', payload: {} });
        expect(fired.bus1.length).to.eql(2);
        expect(fired.bus2.length).to.eql(2);
        fired.reset();

        bus1.fire({ type: 'foo', payload: { msg: 'filter-me' } });
        expect(fired.bus1.length).to.eql(1);
        expect(fired.bus2.length).to.eql(0);
        fired.reset();

        bus2.fire({ type: 'foo', payload: { msg: 'filter-me' } });
        expect(fired.bus1.length).to.eql(0);
        expect(fired.bus2.length).to.eql(1);
        fired.reset();
      });

      it('filter events via [connection.filter(fn)] clone', () => {
        const bus1 = rx.bus<E>();
        const bus2 = rx.bus<E>();
        const pump = Pump.create<E>(bus2);

        Pump.connect(pump)
          .filter((e) => e.event.payload.msg !== 'filter-me')
          .to(bus1);

        const fired = {
          bus1: <E[]>[],
          bus2: <E[]>[],
          reset() {
            fired.bus1 = [];
            fired.bus2 = [];
          },
        };

        bus1.$.subscribe((e) => fired.bus1.push(e));
        bus2.$.subscribe((e) => fired.bus2.push(e));

        bus1.fire({ type: 'foo', payload: {} });
        bus2.fire({ type: 'foo', payload: {} });
        expect(fired.bus1.length).to.eql(2);
        expect(fired.bus2.length).to.eql(2);
        fired.reset();

        bus1.fire({ type: 'foo', payload: { msg: 'filter-me' } });
        expect(fired.bus1.length).to.eql(1);
        expect(fired.bus2.length).to.eql(0);
        fired.reset();

        bus2.fire({ type: 'foo', payload: { msg: 'filter-me' } });
        expect(fired.bus1.length).to.eql(0);
        expect(fired.bus2.length).to.eql(1);
        fired.reset();
      });
    });
  });
});
