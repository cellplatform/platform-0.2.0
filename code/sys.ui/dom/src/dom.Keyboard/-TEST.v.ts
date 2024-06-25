import { Keyboard } from '.';
import { Time, describe, expect, it, rx, type t } from '../test';
import { KeyListener } from './KeyListener';
import { Mock } from './u.Mock';

describe('Keyboard', () => {
  describe('KeyListener', () => {
    it('fires (keydown | keyup)', async () => {
      const fired: KeyboardEvent[] = [];
      KeyListener.keydown((e) => fired.push(e));
      KeyListener.keyup((e) => fired.push(e));

      const downEvent = Mock.keydownEvent();
      const upEvent = Mock.keyupEvent();

      document.dispatchEvent(downEvent);
      document.dispatchEvent(upEvent);

      await Time.wait(0);

      expect(fired.length).to.eql(2);
      expect(fired[0]).to.equal(downEvent);
      expect(fired[1]).to.equal(upEvent);
    });

    it('dispose: removes event listener', async () => {
      /**
       * NOTE: The removing of the event handlers (in particular when multiple handlers
       *       are in play) is done correctly in the borser, however [happy-dom] does not behave
       *       accurately and removes all handlers.
       *
       *       This test only asserts the removal of the event, but does not attempt to
       *       simulate within [happy-dom] any further than this.
       */
      const fired: KeyboardEvent[] = [];
      const keydown = KeyListener.keydown((e) => fired.push(e));
      const keyup = KeyListener.keyup((e) => fired.push(e));

      keydown.dispose();
      keyup.dispose(); // NB: Keyup-2 not disposed.

      const downEvent = Mock.keydownEvent();
      const upEvent = Mock.keyupEvent();

      Mock.fire(downEvent);
      Mock.fire(upEvent);

      await Time.wait(0);
      expect(fired.length).to.eql(0);
    });
  });

  describe('Keyboard.until', () => {
    it('until.on: stops after disposal', () => {
      const life = rx.disposable();
      const until = Keyboard.until(life.dispose$);
      const fired: t.KeyboardKeypress[] = [];
      until.on('KeyZ', (e) => fired.push(e.event));

      Mock.fire();
      expect(fired.length).to.eql(1);

      life.dispose();
      expect(until.disposed).to.eql(true);

      Mock.fire();
      expect(fired.length).to.eql(1);
    });

    it('until.dbl: stops after disposal', async () => {
      const life = rx.disposable();
      const until = Keyboard.until(life.dispose$);
      const dbl = until.dbl();

      const fired: t.KeyboardKeypress[] = [];
      dbl.on('KeyB', (e) => fired.push(e.event));

      const ev = Mock.keydownEvent('b');
      Mock.fire(ev);
      Mock.fire(ev);
      expect(fired.length).to.eql(1);

      until.dispose();
      Mock.fire(ev);
      Mock.fire(ev);
      expect(fired.length).to.eql(1); // No more events after dispose of [until]
    });
  });

  describe('Keyboard.dbl', () => {
    it('no match', async () => {
      const dbl = Keyboard.dbl(2, { threshold: 10 });
      const fired: t.KeyboardKeypress[] = [];
      dbl.on('KeyM', (e) => fired.push(e.event));

      const ev = Mock.keydownEvent('z');
      Mock.fire(ev);
      await Time.wait(10);
      Mock.fire(ev);

      await Time.wait(50);
      expect(fired.length).to.eql(0);

      dbl.dispose();
    });

    it('fires (x2)', async () => {
      const dbl = Keyboard.dbl();
      const fired: t.KeyboardKeypress[] = [];
      dbl.on('KeyM', (e) => fired.push(e.event));

      const ev = Mock.keydownEvent('m');
      Mock.fire(ev); // First keypress.
      await Time.wait(10);
      expect(fired.length).to.eql(0);
      Mock.fire(ev); // Second keypress.

      await Time.wait(20);
      expect(fired.length).to.eql(1);
      expect(fired[0].code).to.eql('KeyM');

      Mock.fire(ev);
      expect(fired.length).to.eql(1); // NB: not increment yet.
      Mock.fire(ev);
      expect(fired.length).to.eql(2);
    });

    it('does not fire (outside time threshold)', async () => {
      const dbl = Keyboard.dbl(10);
      const fired: t.KeyboardKeypress[] = [];
      dbl.on('KeyA', (e) => fired.push(e.event));

      const ev = Mock.keydownEvent('a');
      Mock.fire(ev);
      Mock.fire(ev);
      expect(fired.length).to.eql(1);

      Mock.fire(ev);
      expect(fired.length).to.eql(1);
      await Time.wait(30);
      Mock.fire(ev); // NB: second event comes in after timeout.
      expect(fired.length).to.eql(1); // No change.
    });

    it('disposes', () => {
      const life = rx.disposable();
      const { dispose$ } = life;
      const res1 = Keyboard.dbl(2);
      const res2 = Keyboard.dbl(2, { dispose$ });

      expect(res1.disposed).to.eql(false);
      expect(res2.disposed).to.eql(false);
      life.dispose();
      expect(res1.disposed).to.eql(false);
      expect(res2.disposed).to.eql(true);
      res1.dispose();
      expect(res1.disposed).to.eql(true);
      expect(res2.disposed).to.eql(true);
    });

    it('does not fire when disposed', async () => {
      const dbl = Keyboard.dbl(2, { threshold: 30 });
      const fired: t.KeyboardKeypress[] = [];
      dbl.on('KeyM', (e) => fired.push(e.event));

      const ev = Mock.keydownEvent('m');
      Mock.fire(ev);
      Mock.fire(ev);
      expect(fired.length).to.eql(1);

      dbl.dispose();
      Mock.fire(ev);
      Mock.fire(ev);
      expect(fired.length).to.eql(1);
    });
  });
});
