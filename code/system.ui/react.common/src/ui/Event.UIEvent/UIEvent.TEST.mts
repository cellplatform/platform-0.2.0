import { expect, describe, it } from '../../test';

import { UIEvent } from '.';
import { rx } from '../common';

describe('hooks.UIEvent', (e) => {
  it('bus/instance', () => {
    const bus = rx.bus();
    const instance = 'my-instance';
    const events = UIEvent.Events({ bus, instance });

    expect(events.bus).to.eql(rx.bus.instance(bus));
    expect(events.instance).to.eql(instance);
  });
});
