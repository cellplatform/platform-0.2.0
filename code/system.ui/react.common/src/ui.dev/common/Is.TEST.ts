import { type t } from '../common';

import { Dev, Test, expect, rx } from '../../test.ui';
import { Is } from './Is';

export default Test.describe('Is', async (e) => {
  const bus = rx.bus();
  const instance: t.DevInstance = { bus, id: 'foo' };

  const testSetup = async () => {
    const events = Dev.Bus.Controller({ instance });
    const { ctx } = await Dev.Context.init(instance);

    const dispose = () => events.dispose();
    return { events, ctx, dispose } as const;
  };

  e.it('Is.Ctx', async (e) => {
    const { ctx, dispose } = await testSetup();
    const non = [null, undefined, '', 123, true];

    non.forEach((value) => expect(Is.ctx(value)).to.eql(false));
    expect(Is.ctx(ctx)).to.eql(true);

    dispose();
  });
});
