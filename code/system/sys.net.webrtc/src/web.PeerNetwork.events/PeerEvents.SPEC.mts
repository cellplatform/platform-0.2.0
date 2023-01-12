import { PeerEvents } from '.';
import { rx } from '../common';
import { Dev, expect } from '../test.ui';
import { EventNamespace } from './ns.mjs';

export default Dev.describe('PeerEvents', (e) => {
  e.describe('is', (e) => {
    const payload = {};
    const { is } = EventNamespace;

    e.it('is.base (generic)', () => {
      expect(is.base({ type: 'foo', payload })).to.eql(false);

      expect(is.base({ type: 'sys.net/peer', payload })).to.eql(true);
      expect(is.base({ type: 'sys.net/group', payload })).to.eql(true);
      expect(is.base({ type: 'sys.net/fs', payload })).to.eql(true);
    });

    e.it('is.peer.base', () => {
      expect(is.peer.base({ type: 'foo', payload })).to.eql(false);
      expect(is.peer.base({ type: 'sys.net/peer', payload })).to.eql(true);
      expect(is.peer.base({ type: 'sys.net/peer/foo', payload })).to.eql(true);
    });

    e.it('is.peer.data', () => {
      expect(is.peer.data({ type: 'foo', payload })).to.eql(false);
      expect(is.peer.base({ type: 'sys.net/peer/data', payload })).to.eql(true);
    });

    e.it('is.peer.connection', () => {
      expect(is.peer.connection({ type: 'foo', payload })).to.eql(false);
      expect(is.peer.connection({ type: 'sys.net/peer/conn', payload })).to.eql(true);
    });

    e.it('is.peer.local', () => {
      expect(is.peer.local({ type: 'foo', payload })).to.eql(false);
      expect(is.peer.local({ type: 'sys.net/peer/local', payload })).to.eql(true);
    });

    e.it('is.group.base', () => {
      expect(is.group.base({ type: 'foo', payload })).to.eql(false);
      expect(is.group.base({ type: 'sys.net/group', payload })).to.eql(true);
    });

    e.it('is.fs.base', () => {
      expect(is.fs.base({ type: 'foo', payload })).to.eql(false);
      expect(is.fs.base({ type: 'sys.net/fs', payload })).to.eql(true);
    });
  });

  e.describe('instance', (e) => {
    e.it('instance { bus } id', () => {
      const bus = rx.bus();
      const events = PeerEvents(bus);
      expect(events.instance.bus).to.eql(rx.bus.instance(bus));
    });
  });

  e.describe('clone', (e) => {
    e.it('different instance', () => {
      const bus = rx.bus();
      const root = PeerEvents(bus);
      const clone = root.clone();
      expect(root).to.not.equal(clone);
    });

    e.it('disposes from { dispose$ } parameter', () => {
      const bus = rx.bus();
      const dispose$ = new rx.Subject<void>();
      const events = PeerEvents(bus, { dispose$ });

      let count = 0;
      events.dispose$.subscribe(() => count++);

      events.dispose();
      expect(count).to.eql(1);
    });

    e.it('disposes clone without disposing of source (root)', () => {
      const bus = rx.bus();
      const root = PeerEvents(bus);
      const clone = root.clone();

      const disposed: string[] = [];
      root.dispose$.subscribe(() => disposed.push('events-1'));
      clone.dispose$.subscribe(() => disposed.push('events-2'));

      clone.dispose();
      expect(disposed).to.eql(['events-2']);
    });

    e.it('disposes when source (root) events is disposed', () => {
      const bus = rx.bus();
      const root = PeerEvents(bus);
      const clone1 = root.clone();
      const clone2 = clone1.clone();

      const disposed: string[] = [];
      root.dispose$.subscribe(() => disposed.push('events-1'));
      clone1.dispose$.subscribe(() => disposed.push('events-2'));
      clone2.dispose$.subscribe(() => disposed.push('events-3'));

      root.dispose();
      expect(disposed).to.eql(['events-3', 'events-2', 'events-1']);
    });
  });
});
