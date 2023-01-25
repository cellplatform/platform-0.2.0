import { TextInput } from '..';
import { describe, expect, it } from '../../../test';
import { rx } from '../common';

describe('TextInput', () => {
  describe('Events', () => {
    it('exposed from <CmdCard.Events>', () => {
      const instance = { bus: rx.bus(), id: 'foo' };
      const events = TextInput.Events({ instance });
      expect(events.instance.id).to.eql(instance.id);
      expect(events.instance.bus).to.eql(rx.bus.instance(instance.bus));
    });

    it('clone (non-disposable)', () => {
      const events = TextInput.Events({ instance: { bus: rx.bus(), id: 'foo' } });
      const clone = events.clone();
      expect((clone as any).dispose).to.eql(undefined);
    });
  });
});
